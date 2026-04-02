export const calculateAdminStats = (
  leadsData: Lead[],
  activeAssociates: number
): AdminStats => ({
  totalLeads: leadsData.length,
  convertedLeads: leadsData.filter((l) => l.leadStatus === "converted").length,
  closedDeals: leadsData.filter((l) => l.dealStatus === "closed").length,
  pendingDeals: leadsData.filter((l) => l.dealStatus === "pending").length,
  rejectedDeals: leadsData.filter((l) => l.dealStatus === "rejected").length,
  activeAssociates,
});


export const calculateMonthlyData = (leadsData: Lead[]): MonthlyLeadData[] => {
  const monthlyMap = new Map<string, { leads: number; converted: number }>();
  const now = new Date();

// get data for past 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    monthlyMap.set(monthKey, { leads: 0, converted: 0 });
  }

  // Count leads per month
  leadsData.forEach((lead) => {
    if (!lead.submittedAt) return;

    const date = lead.submittedAt.toDate
      ? lead.submittedAt.toDate()
      : new Date(lead.submittedAt);

    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (monthlyMap.has(monthKey)) {
      const data = monthlyMap.get(monthKey)!;
      data.leads++;
      if (lead.leadStatus === "converted") {
        data.converted++;
      }
    }
  });

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    leads: data.leads,
    converted: data.converted,
  }));
};

export const calculateDealStatusData = (leadsData: Lead[]): DealStatusData[] => {
  const counts = {
    pending: leadsData.filter((l) => l.dealStatus === "pending").length,
    closed: leadsData.filter((l) => l.dealStatus === "closed").length,
    rejected: leadsData.filter((l) => l.dealStatus === "rejected").length,
    new: leadsData.filter((l) => l.dealStatus === null).length,
  };

  return [
    { name: "Pending", value: counts.pending, fill: "hsl(217, 91%, 60%)" },
    { name: "Closed", value: counts.closed, fill: "hsl(142, 71%, 45%)" },
    { name: "Rejected", value: counts.rejected, fill: "hsl(0, 84%, 60%)" },
    { name: "New", value: counts.new, fill: "hsl(45, 93%, 47%)" },
  ];
};