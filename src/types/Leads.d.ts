

 interface LeadForm {
  companyName: string;
  industry: string;
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  referralCode?: string;
  comment?: string;
}

 type LeadStatus = "new" | "converted";
type DealStatus = "pending" | "closed" | "rejected";
type FirestoreTimestamp = Timestamp | Date | string | null | undefined;

interface Lead {
  id:string
  // Associate Information
  associateId: string;
  associateCode: string;
  associateName: string;
  associateEmail: string;

  // Company Information
  companyName: string;
  industry: string;

  // Contact Information
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;

  // Status Tracking
  leadStatus: LeadStatus;
  dealStatus: DealStatus | null;

  // Timestamps
  submittedAt: Timestamp;
  convertedAt?: Timestamp;
  dealClosedAt?: Timestamp;

  // Admin Actions
  adminNotes?: string;
  proposalSent?: boolean;
  proposalSentAt?: Timestamp;
  latestComment?: import("./Comment").Comment | null;
}
