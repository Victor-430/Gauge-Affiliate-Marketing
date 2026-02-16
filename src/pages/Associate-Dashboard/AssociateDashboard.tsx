import { Users, ArrowUpRight, Clock, CheckCircle2, XCircle, SendHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "./components/DashboardLayout";
import { mockAssociate, mockLeads } from "@/data/mockData";

const statCards = [
  { label: "Total Leads", value: mockAssociate.stats.totalLeads, icon: Users },
  { label: "Converted", value: mockAssociate.stats.convertedLeads, icon: ArrowUpRight },
  { label: "Pending Deals", value: mockAssociate.stats.pendingDeals, icon: Clock },
  { label: "Closed Deals", value: mockAssociate.stats.closedDeals, icon: CheckCircle2 },
  { label: "Rejected", value: mockAssociate.stats.rejectedDeals, icon: XCircle },
];

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
    rejected: "bg-destructive text-white",
  };
  return <Badge className={styles[status] || ""}>{status}</Badge>;
}

export default function AssociateDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {mockAssociate.fullName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Code: <span className="font-mono font-medium text-foreground">{mockAssociate.uniqueCode}</span>
            </p>
          </div>
          <Button className="gap-2 self-start">
            <SendHorizontal className="h-4 w-4" />
            Submit New Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border hover:scale-110">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Lead Status</TableHead>
                  <TableHead>Deal Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.industry}</TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead.leadStatus} />
                    </TableCell>
                    <TableCell>
                      <DealStatusBadge status={lead.dealStatus} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {lead.submittedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
