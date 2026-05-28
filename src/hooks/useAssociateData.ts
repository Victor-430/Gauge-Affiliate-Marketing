import { db } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/loginAuthContext";
import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useComment } from "./useComment";
import type { Comment } from "@/types/Comment";

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
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

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

  const convertLead = async (leadId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const leadRef = doc(db, "leads", leadId);

      await updateDoc(leadRef, {
        leadStatus: "converted",
        convertedAt: Timestamp.now(),
      });

      const associateRef = doc(db, "associates", user.uid);
      await updateDoc(associateRef, {
        "stats.convertedLeads": increment(1),
      });

      return { success: true };
    } catch (err) {
      // console.error("Error converting lead:", err);
      throw new Error("Failed to convert lead");
    }
  };

  const undoConvertedLead = async (leadId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        leadStatus: "new",
        convertedAt: null,
      });

      const associateRef = doc(db, "associates", user.uid);

      await updateDoc(associateRef, {
        "stats.convertedLeads": increment(-1),
      });

      return { success: true };
    } catch (err) {
      // console.error("Error undoing lead conversion", err);
      throw new Error("Failed to undo lead conversion");
    }
  };
  return {
    associate,
    leads,
    isLoading,
    error,
    convertLead,
    undoConvertedLead,
    updateLatestCommentForLead,
  };
};
