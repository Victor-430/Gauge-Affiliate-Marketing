import { useCallback, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface LeadEditPayload {
  companyName: string;
  industry: string;
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
}

interface LeadEditResponse {
  success: boolean;
  message?: string;
  updated?: boolean;
}

const parseErrorMessage = (data: any, fallback: string) => {
  return data?.message || data?.error || fallback;
};

export const useLeadEdit = () => {
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editLead = useCallback(async (leadId: string, payload: LeadEditPayload) => {
    setIsEditingLead(true);
    setError(null);

    try {
      const { response, data } = await authFetch<LeadEditResponse>(
        `${API_URL}/leads/${leadId}`,
        {
          method: "PATCH",
          json: payload,
        },
      );

      if (!response.ok || !data?.success) {
        throw new Error(parseErrorMessage(data, "Failed to update lead"));
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update lead";
      setError(message);
      throw err;
    } finally {
      setIsEditingLead(false);
    }
  }, []);

  return {
    editLead,
    isEditingLead,
    error,
  };
};
