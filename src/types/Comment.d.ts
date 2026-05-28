export interface Comment {
  id: string;
  leadId: string;
  createdById: string;
  createdByName: string;
  content: string;
  version: number;
  isEdited: boolean;
  createdAt: any;
  updatedAt: any;
  editedById?: string;
  editedByName?: string;
}

export interface CommentRevision {
  id: string;
  commentId: string;
  versionNumber: number;
  content: string;
  editedById: string;
  editedByName: string;
  editedAt: any;
}

export interface CommentHistoryResponse {
  success: boolean;
  count: number;
  limit: number;
  nextCursor: string | null;
  history: CommentRevision[];
}
