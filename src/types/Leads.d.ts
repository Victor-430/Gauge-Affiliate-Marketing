

// export interface Lead {
//   associateId: string;
//   associateCode: string;
//   clientName: string;
//   clientEmail: string;
//   clientPhone: string;
//   status: LeadStatus;
//   service?: string;
//   notes?: string;
//   submittedAt: FirebaseFirestore.Timestamp;
//   updatedAt: FirebaseFirestore.Timestamp;
//   convertedAt?: FirebaseFirestore.Timestamp;
//   closedAt?: FirebaseFirestore.Timestamp;
// }


export type LeadStatus = "new" | "converted";
export type DealStatus = "pending" | "closed" | "rejected";


export interface Lead {
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
  submittedAt: FirebaseFirestore.Timestamp;     
  convertedAt?: FirebaseFirestore.Timestamp;     
  dealClosedAt?: FirebaseFirestore.Timestamp;    
  
  // Admin Actions 
  adminNotes?: string;           
  proposalSent?: boolean;
  proposalSentAt?: FirebaseFirestore.Timestamp;
}

