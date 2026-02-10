export interface Associate {
  email: string;
  fullName: string;
  phone: number;
  uniqueCode: string;
  affiliateLink: string;
  registrationDate: Timestamp;
  status: 'active' | 'inactive';
  stats: {
    totalLeads: number;
    convertedLeads: number;
    closedDeals: number;
    rejectedDeals: number;
    pendingDeals: number;
  };
}

