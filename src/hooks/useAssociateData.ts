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
import { useEffect, useState } from "react";

export const useAssociateData = () => {
  const { user, loading: authLoading } = useAuth();
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // wait for auth to finish loading
    if (authLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssociate(null);
    setLeads([]);

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

        setLeads(leadsData);
        leadsInitialized = true;
        checkComplete();
      },
      () => {
        // console.error("Error fetching leads", err);
        leadsError = "Failed to load leads";
        leadsInitialized = true;
        checkComplete();
      },
    );

    fetchAssociateData();

    return () => unsubscribe();
  }, [user, authLoading]);

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
  return { associate, leads, isLoading, error, convertLead, undoConvertedLead };
};
