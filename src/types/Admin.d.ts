interface AdminStats extends AssociateStats  {
activeAssociates: number
}

interface MonthlyLeadData {
  month: string;
  leads: number;
  converted: number;
}

 interface DealStatusData {
  name: string;
  value: number;
  fill: string;
}
