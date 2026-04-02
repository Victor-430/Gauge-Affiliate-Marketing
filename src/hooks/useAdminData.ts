import { db } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/loginAuthContext";
import { calculateAdminStats, calculateDealStatusData, calculateMonthlyData } from "@/utils/adminCalculations";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export const useAdminData = () => {
  const { role } = useAuth();

  const [stats, setStats] = useState<AdminStats>({
    totalLeads: 0,
    convertedLeads: 0,
    closedDeals: 0,
    pendingDeals: 0,
    rejectedDeals: 0,
    activeAssociates: 0,
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyLeadData[]>([]);
  const [dealStatusData, setDealStatusData] = useState<DealStatusData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssociates = useCallback(async () => {
    if (role !== "admin") return;

    try {
      const associatesQuery = query(
        collection(db, "associates"),
        where("status", "==", "active")
      );

      const snapshot = await getDocs(associatesQuery);
      const associatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Associate[];

      setAssociates(associatesData);

      setStats((prev) => ({
        ...prev,
        activeAssociates: associatesData.length,
      }));
    } catch (err) {
      console.error("Error fetching associates:", err);
    }
  }, [role]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (role !== "admin") {
      setLoading(false);
      setLeads([]);
      setMonthlyData([]);
      setDealStatusData([]);
      return;
    }

    fetchAssociates();

    const leadsQuery = query(
      collection(db, "leads"),
      orderBy("submittedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

        setLeads(leadsData);

        const newStats = calculateAdminStats(leadsData, associates.length);
        const newMonthlyData = calculateMonthlyData(leadsData);
        const newDealStatusData = calculateDealStatusData(leadsData);

        setStats(newStats);
        setMonthlyData(newMonthlyData);
        setDealStatusData(newDealStatusData);

        setLoading(false);
      },
      (err) => {
        console.error("Error fetching leads:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role, fetchAssociates, associates.length]); 

  return {
    stats,
    leads,
    associates,
    monthlyData,
    dealStatusData,
    loading,
    error,
  };
};