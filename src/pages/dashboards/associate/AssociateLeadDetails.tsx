import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Calendar, Loader2, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAssociateData } from "@/hooks/useAssociateData";
import { useComment } from "@/hooks/useComment";
import { formatFullDate } from "@/utils/FormatDate";
import type { Comment, CommentRevision } from "@/types/Comment";

export default function AssociateLeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { leads, isLoading, error, updateLatestCommentForLead } = useAssociateData();
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

  const [comment, setComment] = useState<Comment | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [history, setHistory] = useState<CommentRevision[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    const loadComment = async () => {
      if (!leadId) return;

      try {
        const latest = await fetchComment(leadId);
        setComment(latest);
        setEditedContent(latest?.content || "");
      } catch (err) {
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
      } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to update comment", { position: "top-right" });
    }
  };

  const handleLoadMoreHistory = async () => {
    if (!comment?.id || !nextCursor) return;

    try {
      const data = await fetchCommentHistory(comment.id, nextCursor, 50);
      setHistory((prev) => [...prev, ...(data.history || [])]);
      setNextCursor(data.nextCursor);
    } catch (err) {
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
          <CardTitle className="flex items-center justify-between">
            <span>{lead.companyName}</span>
            <Badge>{lead.leadStatus}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFetchingComment ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading comment...
            </div>
          ) : comment ? (
            <>
              <div className="rounded-md border p-3 bg-muted/40 text-sm">
                {comment.content}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <User className="h-3 w-3" />
                {comment.createdByName}
                {comment.isEdited ? " (edited)" : ""}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No comment yet</p>
          )}

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">{comment ? "Add Another Comment" : "Add Comment"}</p>
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
                    v{entry.versionNumber} by {entry.editedByName}
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
