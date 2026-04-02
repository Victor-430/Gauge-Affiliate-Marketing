 interface AssociateStats {
  totalLeads: number;
    convertedLeads: number;
    closedDeals: number;
    rejectedDeals: number;
    pendingDeals: number;
 }
 
 interface Associate {
  id:string
  email: string;
  fullName: string;
  phone: string;
  uniqueCode: string;
  affiliateLink: string;
  registrationDate: Timestamp;
  status: 'active' | 'inactive';
  stats: AssociateStats
}

