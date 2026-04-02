import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockAdminStats,
  mockAllLeads,
  mockAssociates,
  monthlyLeadData,
  dealStatusData,
} from "@/data/adminMockData";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const statCards = [
  { label: "Total Leads", value: mockAdminStats.totalLeads, icon: FileText },
  {
    label: "Converted",
    value: mockAdminStats.convertedLeads,
    icon: CheckCircle,
  },
  {
    label: "Closed Deals",
    value: mockAdminStats.closedDeals,
    icon: TrendingUp,
  },
  { label: "Pending Deals", value: mockAdminStats.pendingDeals, icon: Clock },
  { label: "Rejected", value: mockAdminStats.rejectedDeals, icon: XCircle },
  {
    label: "Active Associates",
    value: mockAdminStats.activeAssociates,
    icon: Users,
  },
];

function LeadStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={status === "converted" ? "default" : "secondary"}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}

function DealStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-sm">—</span>;
  const styles: Record<string, string> = {
    pending: "bg-muted text-muted-foreground border-border",
    closed: "bg-primary text-primary-foreground",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <Badge className={`capitalize ${styles[status] || ""}`}>{status}</Badge>
  );
}

export const AdminDashboard = () => {
  const getAssociateName = (associateId: string) => {
    return (
      mockAssociates.find((a) => a.id === associateId)?.fullName || "Unknown"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of all leads, deals, and associate performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyLeadData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(0, 0%, 90%)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(0, 0%, 45%)"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
                  <Tooltip />
                  <Bar
                    dataKey="leads"
                    fill="hsl(0, 0%, 15%)"
                    radius={[4, 4, 0, 0]}
                    name="Leads"
                  />
                  <Bar
                    dataKey="converted"
                    fill="hsl(0, 0%, 55%)"
                    radius={[4, 4, 0, 0]}
                    name="Converted"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deal Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {dealStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Associate</TableHead>
                <TableHead>Lead Status</TableHead>
                <TableHead>Deal Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAllLeads.slice(0, 8).map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.companyName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.industry}
                  </TableCell>
                  <TableCell>{getAssociateName(lead.associateId)}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.leadStatus} />
                  </TableCell>
                  <TableCell>
                    <DealStatusBadge status={lead.dealStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.submittedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
