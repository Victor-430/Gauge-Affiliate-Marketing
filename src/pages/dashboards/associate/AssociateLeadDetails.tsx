import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit3,
  Loader2,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAssociateData } from "@/hooks/useAssociateData";
import { useLeadEdit, type LeadEditPayload } from "@/hooks/useLeadEdit";
import { useComment } from "@/hooks/useComment";
import { formatFullDate } from "@/utils/FormatDate";
import type { Comment, CommentRevision } from "@/types/Comment";

export default function AssociateLeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { leads, isLoading, error, updateLatestCommentForLead } = useAssociateData();
  const { editLead, isEditingLead, error: leadEditError } = useLeadEdit();
  const {
    addComment,
    fetchComment,
    editComment,
    fetchCommentHistory,
    isFetchingComment,
    isAddingComment,
    isEditingComment,
    isFetchingHistory,
  } = useComment();

  const lead = useMemo(
    () => leads.find((item) => item.id === leadId),
    [leads, leadId],
  );

  const [isEditingLeadInfo, setIsEditingLeadInfo] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadEditPayload>({
    companyName: "",
    industry: "",
    contactFullName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [comment, setComment] = useState<Comment | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [history, setHistory] = useState<CommentRevision[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    if (!lead) return;

    setLeadForm({
      companyName: lead.companyName || "",
      industry: lead.industry || "",
      contactFullName: lead.contactFullName || "",
      contactRole: lead.contactRole || "",
      contactEmail: lead.contactEmail || "",
      contactPhone: lead.contactPhone || "",
    });
  }, [lead?.id]);

  useEffect(() => {
    const loadComment = async () => {
      if (!leadId) return;

      try {
        const latest = await fetchComment(leadId);
        setComment(latest);
        setEditedContent(latest?.content || "");
      } catch {
        toast.error("Failed to load comment", { position: "top-right" });
      }
    };

    loadComment();
  }, [leadId, fetchComment]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!comment?.id) return;

      try {
        const data = await fetchCommentHistory(comment.id);
        setHistory(data.history || []);
        setNextCursor(data.nextCursor);
      } catch {
        toast.error("Failed to load comment history", { position: "top-right" });
      }
    };

    loadHistory();
  }, [comment?.id, fetchCommentHistory]);

  const syncLatestComment = (latestComment: Comment | null) => {
    if (!leadId) return;

    setComment(latestComment);
    setEditedContent(latestComment?.content || "");
    updateLatestCommentForLead(leadId, latestComment);
    window.dispatchEvent(
      new CustomEvent("lead-comment-updated", {
        detail: {
          leadId,
          latestComment,
        },
      }),
    );
  };

  const handleLeadFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openEditLead = () => {
    if (!lead) return;

    setLeadForm({
      companyName: lead.companyName || "",
      industry: lead.industry || "",
      contactFullName: lead.contactFullName || "",
      contactRole: lead.contactRole || "",
      contactEmail: lead.contactEmail || "",
      contactPhone: lead.contactPhone || "",
    });
    setIsEditingLeadInfo(true);
  };

  const cancelEditLead = () => {
    if (!lead) return;

    setLeadForm({
      companyName: lead.companyName || "",
      industry: lead.industry || "",
      contactFullName: lead.contactFullName || "",
      contactRole: lead.contactRole || "",
      contactEmail: lead.contactEmail || "",
      contactPhone: lead.contactPhone || "",
    });
    setIsEditingLeadInfo(false);
  };

  const handleSaveLead = async () => {
    if (!leadId) return;

    const payload: LeadEditPayload = {
      companyName: leadForm.companyName.trim(),
      industry: leadForm.industry.trim(),
      contactFullName: leadForm.contactFullName.trim(),
      contactRole: leadForm.contactRole.trim(),
      contactEmail: leadForm.contactEmail.trim(),
      contactPhone: leadForm.contactPhone.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      toast.error("Please fill in all lead fields", { position: "top-right" });
      return;
    }

    try {
      const result = await editLead(leadId, payload);
      toast.success(result?.message || "Lead updated successfully", {
        position: "top-right",
      });
      setIsEditingLeadInfo(false);
    } catch {
      toast.error("Failed to update lead", { position: "top-right" });
    }
  };

  const handleAddComment = async () => {
    if (!leadId) return;

    const trimmed = newCommentContent.trim();
    if (!trimmed) {
      toast.error("Comment cannot be empty", { position: "top-right" });
      return;
    }

    try {
      const data = await addComment({
        leadId,
        content: trimmed,
      });

      const createdComment = data?.comment as Comment | undefined;
      if (createdComment) {
        syncLatestComment(createdComment);
        const historyData = await fetchCommentHistory(createdComment.id);
        setHistory(historyData.history || []);
        setNextCursor(historyData.nextCursor);
      } else {
        const latest = await fetchComment(leadId);
        syncLatestComment(latest);
        if (latest?.id) {
          const historyData = await fetchCommentHistory(latest.id);
          setHistory(historyData.history || []);
          setNextCursor(historyData.nextCursor);
        }
      }

      setNewCommentContent("");
      toast.success(data?.message || "Comment created", {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to add comment", { position: "top-right" });
    }
  };

  const handleSaveComment = async () => {
    if (!comment?.id) return;
    const trimmed = editedContent.trim();

    if (!trimmed) {
      toast.error("Comment cannot be empty", { position: "top-right" });
      return;
    }

    try {
      const data = await editComment(comment.id, {
        content: trimmed,
      });

      if (data?.updated) {
        const refreshed = await fetchComment(leadId || "");
        syncLatestComment(refreshed);

        const historyData = await fetchCommentHistory(comment.id);
        setHistory(historyData.history || []);
        setNextCursor(historyData.nextCursor);
      }

      toast.success(data?.message || "Comment updated", {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to update comment", { position: "top-right" });
    }
  };

  const handleLoadMoreHistory = async () => {
    if (!comment?.id || !nextCursor) return;

    try {
      const data = await fetchCommentHistory(comment.id, nextCursor, 50);
      setHistory((prev) => [...prev, ...(data.history || [])]);
      setNextCursor(data.nextCursor);
    } catch {
      toast.error("Failed to load more history", { position: "top-right" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Lead not found or unauthorized.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>{lead.companyName}</span>
            <div className="flex items-center gap-2">
              <Badge>{lead.leadStatus}</Badge>
              {!isEditingLeadInfo && (
                <Button variant="outline" size="sm" onClick={openEditLead}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Lead
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingLeadInfo ? (
            <div className="space-y-4">
              {leadEditError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{leadEditError}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={leadForm.companyName}
                    onChange={handleLeadFieldChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={leadForm.industry}
                    onChange={handleLeadFieldChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactFullName">Contact Full Name</Label>
                  <Input
                    id="contactFullName"
                    name="contactFullName"
                    value={leadForm.contactFullName}
                    onChange={handleLeadFieldChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactRole">Contact Role</Label>
                  <Input
                    id="contactRole"
                    name="contactRole"
                    value={leadForm.contactRole}
                    onChange={handleLeadFieldChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={leadForm.contactEmail}
                    onChange={handleLeadFieldChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={leadForm.contactPhone}
                    onChange={handleLeadFieldChange}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveLead} disabled={isEditingLead}>
                  {isEditingLead ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving
                    </>
                  ) : (
                    "Save Lead"
                  )}
                </Button>
                <Button variant="outline" onClick={cancelEditLead} disabled={isEditingLead}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p>
                <strong>Industry:</strong> {lead.industry}
              </p>
              <p>
                <strong>Contact:</strong> {lead.contactFullName} ({lead.contactRole})
              </p>
              <p>
                <strong>Email:</strong> {lead.contactEmail}
              </p>
              <p>
                <strong>Phone:</strong> {lead.contactPhone}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted: {formatFullDate(lead.submittedAt)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 lg:space-y-8">
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {comment ? "Add Another Comment" : "Add Comment"}
            </p>
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md min-h-28 text-sm"
              placeholder="Write a comment for this lead..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddComment}
                disabled={isAddingComment}
                className="min-w-28"
              >
                {isAddingComment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding
                  </>
                ) : (
                  "Add Comment"
                )}
              </Button>
            </div>
          </div>

          {comment && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Edit Comment</p>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md min-h-28 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveComment}
                    disabled={isEditingComment}
                    className="min-w-28"
                  >
                    {isEditingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditedContent(comment.content)}
                    disabled={isEditingComment}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {comment && (
        <Card>
          <CardHeader>
            <CardTitle>Edit History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isFetchingHistory && history.length === 0 ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No edit history yet.</p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="border rounded-md p-3 space-y-1">
                  <p className="text-sm">{entry.content}</p>
                  <p className="text-xs text-muted-foreground">
                    edited by {entry.editedByName}
                  </p>
                </div>
              ))
            )}

            {nextCursor && (
              <Button
                variant="outline"
                onClick={handleLoadMoreHistory}
                disabled={isFetchingHistory}
              >
                {isFetchingHistory ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
