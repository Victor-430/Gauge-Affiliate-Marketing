// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { mockAllLeads, mockAssociates } from "@/data/adminMockData";
// import { Lead } from "@/data/mockData";
// import { MoreVertical, Building2, User, Mail, Phone, Briefcase, Calendar, Search, CheckCircle, Clock, XCircle } from "lucide-react";
// import { toast } from "sonner";

// function LeadStatusBadge({ status }: { status: string }) {
//   return (
//     <Badge variant={status === "converted" ? "default" : "secondary"} className="capitalize">
//       {status}
//     </Badge>
//   );
// }

// function DealStatusBadge({ status }: { status: string | null }) {
//   if (!status) return <span className="text-muted-foreground text-sm">—</span>;
//   const styles: Record<string, string> = {
//     pending: "bg-muted text-muted-foreground border-border",
//     closed: "bg-primary text-primary-foreground",
//     rejected: "bg-destructive/10 text-destructive border-destructive/20",
//   };
//   return <Badge className={`capitalize ${styles[status] || ""}`}>{status}</Badge>;
// }

// function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
//   return (
//     <div className="flex items-start gap-3">
//       <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
//       <div>
//         <p className="text-xs text-muted-foreground">{label}</p>
//         <p className="text-sm font-medium">{value}</p>
//       </div>
//     </div>
//   );
// }

// export default function AdminLeads() {
//   const [leads, setLeads] = useState<Lead[]>(mockAllLeads);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [dealFilter, setDealFilter] = useState<string>("all");
//   const [confirmAction, setConfirmAction] = useState<{ leadId: string; status: "closed" | "rejected"; companyName: string } | null>(null);

//   const handleDealStatusUpdate = (leadId: string, newStatus: "pending" | "closed" | "rejected") => {
//     setLeads((prev) =>
//       prev.map((lead) =>
//         lead.id === leadId
//           ? { ...lead, dealStatus: newStatus, dealClosedAt: newStatus === "closed" || newStatus === "rejected" ? new Date().toISOString().split("T")[0] : lead.dealClosedAt }
//           : lead
//       )
//     );
//     if (selectedLead?.id === leadId) {
//       setSelectedLead((prev) => prev ? { ...prev, dealStatus: newStatus, dealClosedAt: newStatus === "closed" || newStatus === "rejected" ? new Date().toISOString().split("T")[0] : prev.dealClosedAt } : null);
//     }
//     toast.success(`Deal status updated to "${newStatus}"`);
//   };

//   const getAssociateName = (associateId: string) =>
//     mockAssociates.find((a) => a.id === associateId)?.fullName || "Unknown";

//   const filtered = leads.filter((lead) => {
//     const matchesSearch =
//       lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
//       lead.contactFullName.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus = statusFilter === "all" || lead.leadStatus === statusFilter;
//     const matchesDeal = dealFilter === "all" || (lead.dealStatus || "none") === dealFilter;
//     return matchesSearch && matchesStatus && matchesDeal;
//   });

//   return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">All Leads</h1>
//           <p className="text-muted-foreground text-sm mt-1">View and manage leads across all associates.</p>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search company or contact..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Lead Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="new">New</SelectItem>
//               <SelectItem value="converted">Converted</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={dealFilter} onValueChange={setDealFilter}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Deal Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Deals</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//               <SelectItem value="none">No Deal</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Table */}
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Company</TableHead>
//                   <TableHead>Contact</TableHead>
//                   <TableHead>Associate</TableHead>
//                   <TableHead>Industry</TableHead>
//                   <TableHead>Lead Status</TableHead>
//                   <TableHead>Deal Status</TableHead>
//                   <TableHead>Submitted</TableHead>
//                   <TableHead className="w-10"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filtered.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
//                       No leads found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filtered.map((lead) => (
//                     <TableRow key={lead.id}>
//                       <TableCell className="font-medium">{lead.companyName}</TableCell>
//                       <TableCell>{lead.contactFullName}</TableCell>
//                       <TableCell className="text-muted-foreground">{getAssociateName(lead.associateId)}</TableCell>
//                       <TableCell className="text-muted-foreground">{lead.industry}</TableCell>
//                       <TableCell><LeadStatusBadge status={lead.leadStatus} /></TableCell>
//                       <TableCell><DealStatusBadge status={lead.dealStatus} /></TableCell>
//                       <TableCell className="text-muted-foreground">{lead.submittedAt}</TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
//                               View Details
//                             </DropdownMenuItem>
//                             {lead.leadStatus === "converted" && (
//                               <>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuLabel className="text-xs">Update Deal Status</DropdownMenuLabel>
//                                 <DropdownMenuItem onClick={() => handleDealStatusUpdate(lead.id, "pending")} disabled={lead.dealStatus === "pending"}>
//                                   <Clock className="h-3.5 w-3.5 mr-2" /> Pending
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => setConfirmAction({ leadId: lead.id, status: "closed", companyName: lead.companyName })} disabled={lead.dealStatus === "closed"}>
//                                   <CheckCircle className="h-3.5 w-3.5 mr-2" /> Closed
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => setConfirmAction({ leadId: lead.id, status: "rejected", companyName: lead.companyName })} disabled={lead.dealStatus === "rejected"}>
//                                   <XCircle className="h-3.5 w-3.5 mr-2" /> Rejected
//                                 </DropdownMenuItem>
//                               </>
//                             )}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Detail Modal */}
//         <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Lead Details</DialogTitle>
//             </DialogHeader>
//             {selectedLead && (
//               <div className="space-y-4 pt-2">
//                 <div className="grid grid-cols-2 gap-4">
//                   <DetailRow icon={Building2} label="Company" value={selectedLead.companyName} />
//                   <DetailRow icon={Briefcase} label="Industry" value={selectedLead.industry} />
//                   <DetailRow icon={User} label="Contact" value={`${selectedLead.contactFullName} — ${selectedLead.contactRole}`} />
//                   <DetailRow icon={Mail} label="Email" value={selectedLead.contactEmail} />
//                   <DetailRow icon={Phone} label="Phone" value={selectedLead.contactPhone} />
//                   <DetailRow icon={User} label="Associate" value={getAssociateName(selectedLead.associateId)} />
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Lead Status</p>
//                     <LeadStatusBadge status={selectedLead.leadStatus} />
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Deal Status</p>
//                     <DealStatusBadge status={selectedLead.dealStatus} />
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <DetailRow icon={Calendar} label="Submitted" value={selectedLead.submittedAt} />
//                   {selectedLead.convertedAt && (
//                     <DetailRow icon={Calendar} label="Converted" value={selectedLead.convertedAt} />
//                   )}
//                   {selectedLead.dealClosedAt && (
//                     <DetailRow icon={Calendar} label="Deal Closed/Rejected" value={selectedLead.dealClosedAt} />
//                   )}
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* Confirmation Dialog */}
//         <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
//           <DialogContent className="sm:max-w-sm">
//             <DialogHeader>
//               <DialogTitle>
//                 {confirmAction?.status === "closed" ? "Close Deal" : "Reject Deal"}
//               </DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to mark the deal for <span className="font-semibold">{confirmAction?.companyName}</span> as <span className="font-semibold">{confirmAction?.status}</span>? This action will prevent the associate from undoing their conversion.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter className="gap-2 sm:gap-0">
//               <Button variant="outline" onClick={() => setConfirmAction(null)}>
//                 Cancel
//               </Button>
//               <Button
//                 variant={confirmAction?.status === "rejected" ? "destructive" : "default"}
//                 onClick={() => {
//                   if (confirmAction) {
//                     handleDealStatusUpdate(confirmAction.leadId, confirmAction.status);
//                     setConfirmAction(null);
//                   }
//                 }}
//               >
//                 Confirm
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//   );
// }
