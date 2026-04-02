
export interface Associate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  uniqueCode: string;
  status: "active" | "pending" | "suspended";
  stats: {
    totalLeads: number;
    convertedLeads: number;
    closedDeals: number;
    rejectedDeals: number;
    pendingDeals: number;
  };
}

export interface Lead {
  id: string;
  associateId: string;
  companyName: string;
  industry: string;
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  leadStatus: "new" | "converted";
  dealStatus: "pending" | "closed" | "rejected" | null;
  submittedAt: string;
  convertedAt?: string;
  dealClosedAt?: string;
}

export interface AdminStats {
  totalAssociates: number;
  activeAssociates: number;
  totalLeads: number;
  convertedLeads: number;
  closedDeals: number;
  rejectedDeals: number;
  pendingDeals: number;
  conversionRate: number;
}

export const mockAdminStats: AdminStats = {
  totalAssociates: 42,
  activeAssociates: 36,
  totalLeads: 187,
  convertedLeads: 98,
  closedDeals: 64,
  rejectedDeals: 18,
  pendingDeals: 16,
  conversionRate: 52.4,
};

export const mockAssociates: Associate[] = [
  {
    id: "assoc-001",
    fullName: "Marcus Johnson",
    email: "marcus@example.com",
    phone: "+1 555-0142",
    uniqueCode: "GAM550E8400",
    status: "active",
    stats: { totalLeads: 24, convertedLeads: 14, closedDeals: 9, rejectedDeals: 3, pendingDeals: 2 },
  },
  {
    id: "assoc-002",
    fullName: "Aisha Patel",
    email: "aisha@example.com",
    phone: "+1 555-0233",
    uniqueCode: "GAM7A3F1200",
    status: "active",
    stats: { totalLeads: 31, convertedLeads: 19, closedDeals: 13, rejectedDeals: 4, pendingDeals: 2 },
  },
  {
    id: "assoc-003",
    fullName: "Carlos Rivera",
    email: "carlos@example.com",
    phone: "+1 555-0344",
    uniqueCode: "GAM9C2D5600",
    status: "active",
    stats: { totalLeads: 18, convertedLeads: 10, closedDeals: 7, rejectedDeals: 1, pendingDeals: 2 },
  },
  {
    id: "assoc-004",
    fullName: "Diana Chen",
    email: "diana@example.com",
    phone: "+1 555-0455",
    uniqueCode: "GAMB1E89A00",
    status: "pending",
    stats: { totalLeads: 8, convertedLeads: 3, closedDeals: 1, rejectedDeals: 1, pendingDeals: 1 },
  },
  {
    id: "assoc-005",
    fullName: "Erik Johansson",
    email: "erik@example.com",
    phone: "+1 555-0566",
    uniqueCode: "GAMD4F7BE00",
    status: "suspended",
    stats: { totalLeads: 5, convertedLeads: 2, closedDeals: 1, rejectedDeals: 1, pendingDeals: 0 },
  },
];

export const mockAllLeads: Lead[] = [
  {
    id: "lead-001", associateId: "assoc-001", companyName: "TechVault Solutions", industry: "Technology",
    contactFullName: "Sarah Chen", contactRole: "CTO", contactEmail: "sarah@techvault.com", contactPhone: "+1 555-0201",
    leadStatus: "converted", dealStatus: "closed", submittedAt: "2026-01-28", convertedAt: "2026-02-02", dealClosedAt: "2026-02-10",
  },
  {
    id: "lead-002", associateId: "assoc-001", companyName: "GreenField Logistics", industry: "Logistics",
    contactFullName: "David Park", contactRole: "Operations Director", contactEmail: "david@greenfield.com", contactPhone: "+1 555-0302",
    leadStatus: "converted", dealStatus: "pending", submittedAt: "2026-02-01", convertedAt: "2026-02-06",
  },
  {
    id: "lead-003", associateId: "assoc-001", companyName: "Nova Financial Group", industry: "Finance",
    contactFullName: "Emily Rodriguez", contactRole: "VP of Partnerships", contactEmail: "emily@novafinancial.com", contactPhone: "+1 555-0403",
    leadStatus: "new", dealStatus: null, submittedAt: "2026-02-08",
  },
  {
    id: "lead-006", associateId: "assoc-002", companyName: "Pinnacle Health Systems", industry: "Healthcare",
    contactFullName: "Dr. Robert Kim", contactRole: "Chief Medical Officer", contactEmail: "rkim@pinnaclehealth.com", contactPhone: "+1 555-0701",
    leadStatus: "converted", dealStatus: "closed", submittedAt: "2026-01-20", convertedAt: "2026-01-25", dealClosedAt: "2026-02-05",
  },
  {
    id: "lead-007", associateId: "assoc-002", companyName: "Orbit Aerospace", industry: "Aerospace",
    contactFullName: "Karen Walsh", contactRole: "Head of Procurement", contactEmail: "kwalsh@orbitaero.com", contactPhone: "+1 555-0802",
    leadStatus: "converted", dealStatus: "pending", submittedAt: "2026-02-03", convertedAt: "2026-02-08",
  },
  {
    id: "lead-008", associateId: "assoc-003", companyName: "Redwood Construction", industry: "Construction",
    contactFullName: "Tom Bradley", contactRole: "Project Director", contactEmail: "tom@redwoodconst.com", contactPhone: "+1 555-0903",
    leadStatus: "new", dealStatus: null, submittedAt: "2026-02-14",
  },
  {
    id: "lead-009", associateId: "assoc-003", companyName: "Blue Ocean Retail", industry: "Retail",
    contactFullName: "Maria Santos", contactRole: "VP Operations", contactEmail: "maria@blueocean.com", contactPhone: "+1 555-1004",
    leadStatus: "converted", dealStatus: "rejected", submittedAt: "2026-01-10", convertedAt: "2026-01-18", dealClosedAt: "2026-02-01",
  },
  {
    id: "lead-010", associateId: "assoc-004", companyName: "Solaris Energy", industry: "Energy",
    contactFullName: "Ahmed Hassan", contactRole: "Business Dev Manager", contactEmail: "ahmed@solaris.com", contactPhone: "+1 555-1105",
    leadStatus: "new", dealStatus: null, submittedAt: "2026-02-16",
  },
];

export const monthlyLeadData = [
  { month: "Sep", leads: 12, converted: 5 },
  { month: "Oct", leads: 18, converted: 9 },
  { month: "Nov", leads: 22, converted: 11 },
  { month: "Dec", leads: 15, converted: 8 },
  { month: "Jan", leads: 28, converted: 16 },
  { month: "Feb", leads: 21, converted: 12 },
];

export const dealStatusData = [
  { name: "Closed", value: 64, fill: "hsl(0, 0%, 15%)" },
  { name: "Pending", value: 16, fill: "hsl(0, 0%, 55%)" },
  { name: "Rejected", value: 18, fill: "hsl(0, 0%, 82%)" },
];
