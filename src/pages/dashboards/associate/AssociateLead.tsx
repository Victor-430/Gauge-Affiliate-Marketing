import { useEffect, useState } from "react";
import {
  MoreVertical,
  ArrowUpRight,
  Undo2,
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAssociateData } from "@/hooks/useAssociateData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatFullDate } from "@/utils/FormatDate";

function LeadStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={status === "converted" ? "default" : "secondary"}
      className={status === "converted" ? "bg-foreground text-background" : ""}
    >
      {status}
    </Badge>
  );
}

function DealStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  const styles: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    closed: "bg-foreground text-background",
    rejected: "bg-destructive text-destructive-foreground",
  };
  return <Badge className={styles[status] || ""}>{status}</Badge>;
}

function LeadDetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function AssociateLeads() {
  const {
    leads,
    isLoading: loading,
    error,
    convertLead,
    undoConvertedLead,
  } = useAssociateData();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [converting, setConverting] = useState(false);
  const [undoing, setUndoing] = useState(false);

useEffect(() => {
  if (selectedLead) {
    const updated = leads.find((l) => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  }
}, [leads]);


  const canConvert = (lead: Lead) => {
    return (
      lead?.leadStatus === "new" &&
      lead?.dealStatus !== "closed" &&
      lead?.dealStatus !== "rejected"
    );
  };

  const canUndo = (lead: Lead) => {
    if (lead?.leadStatus !== "converted" || !lead?.convertedAt) return false;
    if (lead?.dealStatus === "closed" || lead?.dealStatus === "rejected")
      return false;
// console.log(lead.convertedAt.toDate().getTime())
    return Date.now() - lead.convertedAt.toDate().getTime() < 30 * 60 * 1000;
  };

  const handleConvert = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead && !canConvert(lead)) {
      toast.error("Cannot convert: deal is closed or rejected", {
        position: "top-right",
      });
      return;
    }

    setConverting(true);
    try {
      await convertLead(leadId);
      toast.success(
        "Lead marked as converted. You can undo within 30 minutes.",
        {
          position: "top-right",
        },
      );
    } catch (err) {
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
      setSelectedLead(null);
      toast.success("Lead reverted to new", {
        position: "top-right",
      });
    } catch (err) {
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all your submitted leads. Convert leads after
            successful follow up.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              All Leads ({leads.length})
            </CardTitle>
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
                    <TableHead>Deal Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead?.companyName}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{lead?.contactFullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {lead?.contactRole}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead?.industry}
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead?.leadStatus} />
                      </TableCell>
                      <TableCell>
                        <DealStatusBadge status={lead?.dealStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(lead?.submittedAt)} 
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedLead(lead)}
                            >
                              View Details
                            </DropdownMenuItem>
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

        {/* Lead Detail Modal */}
        <Dialog
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedLead?.companyName}</DialogTitle>
              <DialogDescription>
                Full lead details and actions
              </DialogDescription>
            </DialogHeader>

            {selectedLead && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <LeadStatusBadge status={selectedLead.leadStatus} />
                  <DealStatusBadge status={selectedLead.dealStatus} />
                </div>

                <Separator />

                <div className="grid gap-4">
                  <LeadDetailRow
                    icon={Building2}
                    label="Industry"
                    value={selectedLead.industry}
                  />
                  <LeadDetailRow
                    icon={User}
                    label="Contact Name"
                    value={selectedLead.contactFullName}
                  />
                  <LeadDetailRow
                    icon={Briefcase}
                    label="Role"
                    value={selectedLead.contactRole}
                  />
                  <LeadDetailRow
                    icon={Mail}
                    label="Email"
                    value={selectedLead.contactEmail}
                  />
                  <LeadDetailRow
                    icon={Phone}
                    label="Phone"
                    value={selectedLead.contactPhone}
                  />
                  <LeadDetailRow
                    icon={Calendar}
                    label="Submitted"
                    value={formatFullDate(selectedLead.submittedAt)}
                  />
                  {selectedLead.convertedAt && (
                    <LeadDetailRow
                      icon={Calendar}
                      label="Converted"
                      value={ formatFullDate(selectedLead.convertedAt) }
                    />
                  )}
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  {canConvert(selectedLead) && (
                    <Button
                      onClick={() => handleConvert(selectedLead.id)}
                      disabled={converting}
                      className="gap-1.5"
                    >
                      {converting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="h-4 w-4" />
                          Convert Lead
                        </>
                      )}
                    </Button>
                  )}
                  {canUndo(selectedLead) && (
                    <Button
                      variant="outline"
                      onClick={() => handleUndo(selectedLead.id)}
                      disabled={undoing}
                      className="gap-1.5"
                    >
                      {undoing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Undoing...
                        </>
                      ) : (
                        <>
                          <Undo2 className="h-4 w-4" />
                          Undo Convert
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
