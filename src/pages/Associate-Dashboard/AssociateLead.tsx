import { useState } from "react";
import { MoreVertical, ArrowUpRight, Undo2, Building2, User, Mail, Phone, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "./components/DashboardLayout"; 
import { mockLeads, type Lead } from "@/data/mockData";
import { toast } from "sonner";

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

function LeadDetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleConvert = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, leadStatus: "converted" as const, convertedAt: new Date().toISOString().split("T")[0] }
          : lead
      )
    );
    setSelectedLead(null);
    toast.success("Lead marked as converted");
  };

  const handleUndo = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, leadStatus: "new" as const, convertedAt: undefined }
          : lead
      )
    );
    setSelectedLead(null);
    toast.success("Lead reverted to new");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all your submitted leads. Convert leads after successful follow-up.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{lead.contactFullName}</p>
                        <p className="text-xs text-muted-foreground">{lead.contactRole}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.industry}</TableCell>
                    <TableCell><LeadStatusBadge status={lead.leadStatus} /></TableCell>
                    <TableCell><DealStatusBadge status={lead.dealStatus} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.submittedAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                            View Details
                          </DropdownMenuItem>
                          {lead.leadStatus === "new" ? (
                            <DropdownMenuItem onClick={() => handleConvert(lead.id)}>
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Convert
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUndo(lead.id)}>
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
          </CardContent>
        </Card>

        {/* Lead Detail Modal */}
        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedLead?.companyName}</DialogTitle>
              <DialogDescription>Full lead details and actions</DialogDescription>
            </DialogHeader>

            {selectedLead && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <LeadStatusBadge status={selectedLead.leadStatus} />
                  <DealStatusBadge status={selectedLead.dealStatus} />
                </div>

                <Separator />

                <div className="grid gap-4">
                  <LeadDetailRow icon={Building2} label="Industry" value={selectedLead.industry} />
                  <LeadDetailRow icon={User} label="Contact Name" value={selectedLead.contactFullName} />
                  <LeadDetailRow icon={Briefcase} label="Role" value={selectedLead.contactRole} />
                  <LeadDetailRow icon={Mail} label="Email" value={selectedLead.contactEmail} />
                  <LeadDetailRow icon={Phone} label="Phone" value={selectedLead.contactPhone} />
                  <LeadDetailRow icon={Calendar} label="Submitted" value={selectedLead.submittedAt} />
                  {selectedLead.convertedAt && (
                    <LeadDetailRow icon={Calendar} label="Converted" value={selectedLead.convertedAt} />
                  )}
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  {selectedLead.leadStatus === "new" ? (
                    <Button onClick={() => handleConvert(selectedLead.id)} className="gap-1.5">
                      <ArrowUpRight className="h-4 w-4" />
                      Convert Lead
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => handleUndo(selectedLead.id)} className="gap-1.5">
                      <Undo2 className="h-4 w-4" />
                      Undo Convert
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
