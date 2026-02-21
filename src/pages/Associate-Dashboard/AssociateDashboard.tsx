import {
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  SendHorizontal,
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
import { DashboardLayout } from "./components/DashboardLayout";
import { useAssociateData } from "@/hooks/useAssociateData";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { associate, leads, isLoading, error } = useAssociateData();
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return "__";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error(error);
      return "__";
    }
  };

  const handleSubmitLead = () => {
    navigate(`/submit-lead?ref=${associate?.uniqueCode}`);
  };

  const handleCopyLink = () => {
    if (associate?.affiliateLink) {
      navigator.clipboard.writeText(associate.affiliateLink);
      toast("Affiliate link was copied", { position: "top-right" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !associate) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Failed to load dashboard data. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Leads", value: associate.stats?.totalLeads, icon: Users },
    {
      label: "Converted",
      value: associate.stats?.convertedLeads,
      icon: ArrowUpRight,
    },
    {
      label: "Pending Deals",
      value: associate.stats?.pendingDeals,
      icon: Clock,
    },
    {
      label: "Closed Deals",
      value: associate.stats?.closedDeals,
      icon: CheckCircle2,
    },
    { label: "Rejected", value: associate.stats?.rejectedDeals, icon: XCircle },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {associate?.fullName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Code:{" "}
              <span className="font-mono font-medium text-foreground">
                {associate?.uniqueCode}
              </span>
            </p>
          </div>
           <Button className="gap-2 self-start">
              <SendHorizontal className="h-4 w-4" />
              Submit New Lead
            </Button>
          
        </div>

 {/* Affiliate Link Card */}
        <Card className="bg-linear-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Your Affiliate Link:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-4 py-2 rounded border text-sm break-all">
                {associate.affiliateLink}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Card
              key={stat.label}
              className="border border-border hover:scale-110"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Leads ({leads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No leads yet</p>
                <p className="text-sm mb-4">
                  Start by submitting your first lead
                </p>
                <Button onClick={handleSubmitLead} variant="outline">
                  Submit Lead
                </Button>
              </div>
            ) : (
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
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.companyName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.industry}
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.leadStatus} />
                      </TableCell>
                      <TableCell>
                        <DealStatusBadge status={lead.dealStatus} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDate(lead.submittedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
