import { useCallback, useState } from "react";
import type { Comment, CommentHistoryResponse } from "@/types/Comment";
import { authFetch } from "@/lib/authFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AddCommentPayload {
  leadId: string;
  content: string;
}

interface EditCommentPayload {
  content: string;
}

interface FetchCommentsResponse {
  success: boolean;
  comments: Comment[];
}

interface CreateCommentResponse {
  success: boolean;
  message: string;
  comment: Comment;
}

interface EditCommentResponse {
  success: boolean;
  message: string;
  updated: boolean;
  commentId?: string;
  newVersion?: number;
}

const parseErrorMessage = (data: any, fallback: string) => {
  return data?.message || data?.error || fallback;
};

export const useComment = () => {
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComment = useCallback(async (leadId: string) => {
    setIsFetchingComment(true);
    setError(null);

    try {
      const { response, data } = await authFetch<FetchCommentsResponse>(
        `${API_URL}/comments/lead/${leadId}`,
      );

      if (!response.ok) {
        throw new Error(parseErrorMessage(data, "Failed to fetch comments"));
      }

      const latestComment = Array.isArray(data?.comments) ? data.comments[0] : null;
      return latestComment as Comment | null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch comments";
       
      setError(message);
      throw err;
    } finally {
      setIsFetchingComment(false);
    }
  }, []);

  const addComment = useCallback(async (payload: AddCommentPayload) => {
    setIsAddingComment(true);
    setError(null);

    try {
      const trimmedContent = payload.content.trim();

      if (!trimmedContent) {
        throw new Error("Comment cannot be empty");
      }

      const { response, data } = await authFetch<CreateCommentResponse>(`${API_URL}/comments`, {
        method: "POST",
        json: {
          leadId: payload.leadId,
          content: trimmedContent,
        },
      });

      if (!response.ok || !data?.success) {
        throw new Error(parseErrorMessage(data, "Failed to create comment"));
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create comment";
      setError(message);
      throw err;
    } finally {
      setIsAddingComment(false);
    }
  }, []);

  const editComment = useCallback(
    async (commentId: string, payload: EditCommentPayload) => {
      setIsEditingComment(true);
      setError(null);

      try {
        const { response, data } = await authFetch<EditCommentResponse>(
          `${API_URL}/comments/${commentId}`,
          {
          method: "PATCH",
          json: payload,
        },
        );

        if (!response.ok || !data?.success) {
          throw new Error(parseErrorMessage(data, "Failed to edit comment"));
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to edit comment";
        setError(message);
        throw err;
      } finally {
        setIsEditingComment(false);
      }
    },
    [],
  );

  const fetchCommentHistory = useCallback(
    async (commentId: string, nextCursor?: string, limit = 50) => {
      setIsFetchingHistory(true);
      setError(null);

      try {
        const safeLimit = Math.min(Math.max(limit, 1), 50);
        const query = new URLSearchParams({
          limit: String(safeLimit),
        });

        if (nextCursor) {
          query.set("nextCursor", nextCursor);
        }

        const { response, data } = await authFetch<CommentHistoryResponse>(
          `${API_URL}/comments/${commentId}/history?${query.toString()}`,
        );

        if (!response.ok || !data?.success) {
          throw new Error(parseErrorMessage(data, "Failed to fetch comment history"));
        }

        return data as CommentHistoryResponse;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch comment history";
        setError(message);
        throw err;
      } finally {
        setIsFetchingHistory(false);
      }
    },
    [],
  );

  return {
    fetchComment,
    addComment,
    editComment,
    fetchCommentHistory,
    isFetchingComment,
    isAddingComment,
    isEditingComment,
    isFetchingHistory,
    error,
  };
};
