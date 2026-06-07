import { db } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/loginAuthContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useComment } from "./useComment";
import type { Comment } from "@/types/Comment";
import { authFetch } from "@/lib/authFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface StatusUpdateResponse {
  success: boolean;
  message?: string;
}

const parseErrorMessage = (data: any, fallback: string) => {
  return data?.message || data?.error || fallback;
};

const normalizeLeadStatus = (status: Lead["leadStatus"]) => {
  return status === "new" ? "pending" : status;
};

const normalizeDealStatus = (status: Lead["dealStatus"]) => {
  return status === "closed" ? "approved" : status;
};

export const useAssociateData = () => {
  const { user, loading: authLoading } = useAuth();
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestCommentMapRef = useRef<Record<string, Comment | null>>({});
  const { fetchComment } = useComment();

  const updateLatestCommentForLead = useCallback(
    (leadId: string, latestComment: Comment | null) => {
      if (!leadId) return;

      latestCommentMapRef.current[leadId] = latestComment;
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                latestComment,
              }
            : lead,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    // wait for auth to finish loading
    if (authLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssociate(null);
    setLeads([]);
    latestCommentMapRef.current = {};

    if (!user) {
      setIsLoading(false);
      return;
    }

    let associateFetched = false;
    let leadsInitialized = false;
    let associateError: string | null = null;
    let leadsError: string | null = null;

    // show error only when both operations are complete
    const checkComplete = () => {
      if (associateFetched && leadsInitialized) {
        if (associateError) {
          setError(associateError);
        } else if (leadsError) {
          setError(leadsError);
        }

        setIsLoading(false);
      }
    };

    const fetchAssociateData = async () => {
      try {
        const associateDoc = await getDoc(doc(db, "associates", user.uid));

        if (associateDoc.exists()) {
          setAssociate(associateDoc.data() as Associate);
        } else {
          associateError = "Associate profile not found";
        }
      } catch (error) {
        // console.error("Error fetching associate data", error);
        associateError = "Failed to load profile data";
      } finally {
        associateFetched = true;
        checkComplete();
      }
    };

    const leadQuery = query(
      collection(db, "leads"),
      where("associateId", "==", user.uid),
      orderBy("submittedAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      leadQuery,
      (snapshot) => {
        const leadsData = snapshot.docs.map((doc) => {
          const data = doc.data() as Lead;

          return {
            ...data,
            id: doc.id,
            leadStatus: normalizeLeadStatus(data.leadStatus),
            dealStatus: normalizeDealStatus(data.dealStatus),
          };
        }) as Lead[];

        const hydratedLeads = leadsData.map((lead) => ({
          ...lead,
          latestComment: latestCommentMapRef.current[lead.id] ?? null,
        }));

        setLeads(hydratedLeads);
        leadsInitialized = true;
        checkComplete();

        const leadsToHydrate = hydratedLeads.filter(
          (lead) => latestCommentMapRef.current[lead.id] === undefined,
        );

        if (leadsToHydrate.length > 0) {
          Promise.all(
            leadsToHydrate.map(async (lead) => {
              try {
                const latestComment = await fetchComment(lead.id);
                updateLatestCommentForLead(lead.id, latestComment);
              } catch {
                updateLatestCommentForLead(lead.id, null);
              }
            }),
          );
        }
      },
      () => {
        // console.error("Error fetching leads", err);
        leadsError = "Failed to load leads";
        leadsInitialized = true;
        checkComplete();
      },
    );

    fetchAssociateData();

    const handleLeadCommentUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        leadId?: string;
        latestComment?: Comment | null;
      }>;

      const updatedLeadId = customEvent.detail?.leadId;
      if (!updatedLeadId) return;

      updateLatestCommentForLead(updatedLeadId, customEvent.detail.latestComment ?? null);
    };

    window.addEventListener("lead-comment-updated", handleLeadCommentUpdated as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener(
        "lead-comment-updated",
        handleLeadCommentUpdated as EventListener,
      );
    };
  }, [user, authLoading, fetchComment, updateLatestCommentForLead]);

  const updateLeadStatus = async (leadId: string, path: string, fallback: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { response, data } = await authFetch<StatusUpdateResponse>(
        `${API_URL}/leads/${leadId}/${path}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok || !data?.success) {
        throw new Error(parseErrorMessage(data, fallback));
      }

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error(fallback);
    }
  };

  const markProspect = async (leadId: string) => {
    return updateLeadStatus(
      leadId,
      "status/prospect",
      "Failed to mark lead as prospect",
    );
  };

  const convertLead = async (leadId: string) => {
    return updateLeadStatus(leadId, "status/convert", "Failed to convert lead");
  };

  const undoConvertedLead = async (leadId: string) => {
    return updateLeadStatus(
      leadId,
      "status/undo-conversion",
      "Failed to undo lead conversion",
    );
  };
  return {
    associate,
    leads,
    isLoading,
    error,
    markProspect,
    convertLead,
    undoConvertedLead,
    updateLatestCommentForLead,
  };
};
