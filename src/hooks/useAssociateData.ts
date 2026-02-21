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
import { useEffect, useState } from "react";

export const useAssociateData = () => {
  const { user } = useAuth();
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchAssociateData = async () => {
      try {
        const associateDoc = await getDoc(doc(db, "associates", user.uid));

        if (associateDoc.exists()) {
          setIsLoading(true)
          setAssociate(associateDoc.data() as Associate);
        } else {
          setError("Associate profile not found");
        }
      } catch (error) {
        console.error("Error fetching associate data", error);
        setError("Failed to load profile data");
      }finally{
        setIsLoading(false)
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
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching leads", err);
        setError("Failed to load leads");
        setIsLoading(false);
      },
    );

    fetchAssociateData()

    return () => unsubscribe()
  }, [user]);

  return {associate, leads, isLoading, error}
};
