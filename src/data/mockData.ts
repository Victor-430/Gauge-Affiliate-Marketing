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

export const mockAssociate: Associate = {
  id: "assoc-001",
  fullName: "Marcus Johnson",
  email: "marcus@example.com",
  phone: "+1 555-0142",
  uniqueCode: "GAM550E8400",
  status: "active",
  stats: {
    totalLeads: 24,
    convertedLeads: 14,
    closedDeals: 9,
    rejectedDeals: 3,
    pendingDeals: 2,
  },
};

export const mockLeads: Lead[] = [
  {
    id: "lead-001",
    associateId: "assoc-001",
    companyName: "TechVault Solutions",
    industry: "Technology",
    contactFullName: "Sarah Chen",
    contactRole: "CTO",
    contactEmail: "sarah@techvault.com",
    contactPhone: "+1 555-0201",
    leadStatus: "converted",
    dealStatus: "closed",
    submittedAt: "2026-01-28",
    convertedAt: "2026-02-02",
    dealClosedAt: "2026-02-10",
  },
  {
    id: "lead-002",
    associateId: "assoc-001",
    companyName: "GreenField Logistics",
    industry: "Logistics",
    contactFullName: "David Park",
    contactRole: "Operations Director",
    contactEmail: "david@greenfield.com",
    contactPhone: "+1 555-0302",
    leadStatus: "converted",
    dealStatus: "pending",
    submittedAt: "2026-02-01",
    convertedAt: "2026-02-06",
  },
  {
    id: "lead-003",
    associateId: "assoc-001",
    companyName: "Nova Financial Group",
    industry: "Finance",
    contactFullName: "Emily Rodriguez",
    contactRole: "VP of Partnerships",
    contactEmail: "emily@novafinancial.com",
    contactPhone: "+1 555-0403",
    leadStatus: "new",
    dealStatus: null,
    submittedAt: "2026-02-08",
  },
  {
    id: "lead-004",
    associateId: "assoc-001",
    companyName: "Apex Manufacturing",
    industry: "Manufacturing",
    contactFullName: "James Wu",
    contactRole: "Procurement Manager",
    contactEmail: "james@apexmfg.com",
    contactPhone: "+1 555-0504",
    leadStatus: "converted",
    dealStatus: "rejected",
    submittedAt: "2026-01-15",
    convertedAt: "2026-01-22",
    dealClosedAt: "2026-02-05",
  },
  {
    id: "lead-005",
    associateId: "assoc-001",
    companyName: "Horizon Media Co.",
    industry: "Media",
    contactFullName: "Lisa Thompson",
    contactRole: "CEO",
    contactEmail: "lisa@horizonmedia.com",
    contactPhone: "+1 555-0605",
    leadStatus: "new",
    dealStatus: null,
    submittedAt: "2026-02-12",
  },
];
