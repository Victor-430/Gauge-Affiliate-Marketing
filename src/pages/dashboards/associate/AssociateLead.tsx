import {
  MoreVertical,
  ArrowUpRight,
  Undo2,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAssociateData } from "@/hooks/useAssociateData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/utils/FormatDate";
import { useNavigate } from "react-router";

const formatStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pending",
    prospect: "Prospect",
    converted: "Converted",
    approved: "Approved",
    rejected: "Rejected",
    closed: "Approved",
    new: "Pending",
  };

  return labels[status] || status;
};

function LeadStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status === "new" ? "pending" : status;
  const styles: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    prospect: "bg-blue-100 text-blue-700",
    converted: "bg-foreground text-background",
  };

  return (
    <Badge
      variant={normalizedStatus === "converted" ? "default" : "secondary"}
      className={styles[normalizedStatus] || ""}
    >
      {formatStatusLabel(normalizedStatus)}
    </Badge>
  );
}

function DealStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">-</span>;
  const normalizedStatus = status === "closed" ? "approved" : status;
  const styles: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-foreground text-background",
    rejected: "bg-destructive text-destructive-foreground",
  };
  return (
    <Badge className={styles[normalizedStatus] || ""}>
      {formatStatusLabel(normalizedStatus)}
    </Badge>
  );
}

const getTimestampMs = (timestamp: Lead["convertedAt"]) => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === "function") return timestamp.toDate().getTime();

  const parsed = new Date(timestamp as unknown as Date | string).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

export default function AssociateLeads() {
  const {
    leads,
    isLoading: loading,
    error,
    markProspect,
    convertLead,
    undoConvertedLead,
  } = useAssociateData();
  const [prospecting, setProspecting] = useState(false);
  const [converting, setConverting] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const navigate = useNavigate();

  const canMarkProspect = (lead: Lead) => {
    return lead?.leadStatus === "pending" && !lead?.dealStatus;
  };

  const canConvert = (lead: Lead) => {
    return (
      (lead?.leadStatus === "pending" || lead?.leadStatus === "prospect") &&
      lead?.dealStatus !== "approved" &&
      lead?.dealStatus !== "rejected"
    );
  };

  const canUndo = (lead: Lead) => {
    if (lead?.leadStatus !== "converted" || !lead?.convertedAt) return false;
    if (lead?.dealStatus !== "pending") return false;
    const convertedAtMs = getTimestampMs(lead.convertedAt);
    if (!convertedAtMs) return false;
    return Date.now() - convertedAtMs < 30 * 60 * 1000;
  };

  const handleMarkProspect = async (leadId: string) => {
    setProspecting(true);
    try {
      await markProspect(leadId);
      toast.success("Lead marked as prospect", {
        position: "top-right",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark prospect", {
        position: "top-right",
      });
    } finally {
      setProspecting(false);
    }
  };

  const handleConvert = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead && !canConvert(lead)) {
      toast.error("Cannot convert this lead", {
        position: "top-right",
      });
      return;
    }

    setConverting(true);
    try {
      await convertLead(leadId);
      toast.success("Lead marked as converted. You can undo within 30 minutes.", {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to convert lead. Please try again.", {
        position: "top-right",
      });
    } finally {
      setConverting(false);
    }
  };

  const handleUndo = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead && !canUndo(lead)) {
      toast.error("Undo window has expired (30 minutes)");
      return;
    }

    setUndoing(true);
    try {
      await undoConvertedLead(leadId);
      toast.success("Lead reverted to pending", {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to undo conversion. Please try again.", {
        position: "top-right",
      });
    } finally {
      setUndoing(false);
    }
  };

  if (loading) {
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
          <AlertDescription>
            {error || "Failed to load leads. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all your submitted leads. Convert leads after successful follow
          up.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No leads yet</p>
              <p className="text-sm">Leads you submit will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Lead Status</TableHead>
                  {/* <TableHead>Deal Status</TableHead> */}
                  <TableHead>Latest Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead?.companyName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{lead?.contactFullName}</p>
                        <p className="text-xs text-muted-foreground">{lead?.contactRole}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead?.industry}</TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead?.leadStatus} />
                    </TableCell>
                    {/* <TableCell>
                      <DealStatusBadge status={lead?.dealStatus} />
                    </TableCell> */}
                    <TableCell className="text-muted-foreground text-sm max-w-65 truncate">
                      {lead.latestComment?.content || "No comment yet"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(lead?.submittedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          {canMarkProspect(lead) && (
                            <DropdownMenuItem
                              onClick={() => handleMarkProspect(lead?.id)}
                              disabled={prospecting}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Prospect
                            </DropdownMenuItem>
                          )}
                          {canConvert(lead) && (
                            <DropdownMenuItem
                              onClick={() => handleConvert(lead?.id)}
                              disabled={converting}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Convert
                            </DropdownMenuItem>
                          )}
                          {canUndo(lead) && (
                            <DropdownMenuItem
                              onClick={() => handleUndo(lead?.id)}
                              disabled={undoing}
                            >
                              <Undo2 className="h-4 w-4 mr-2" />
                              Undo Convert
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
