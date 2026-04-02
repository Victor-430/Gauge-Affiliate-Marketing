
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { mockAdminStats, mockAssociates, monthlyLeadData, dealStatusData } from "@/data/adminMockData";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

// const conversionTrend = [
//   { month: "Sep", rate: 41.7 },
//   { month: "Oct", rate: 50.0 },
//   { month: "Nov", rate: 50.0 },
//   { month: "Dec", rate: 53.3 },
//   { month: "Jan", rate: 57.1 },
//   { month: "Feb", rate: 57.1 },
// ];

// export default function AdminReports() {
//   return (
//      <div className="space-y-8">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
//           <p className="text-muted-foreground text-sm mt-1">Analytics and performance metrics.</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-xs text-muted-foreground">Conversion Rate</p>
//               <p className="text-2xl font-bold mt-1">{mockAdminStats.conversionRate}%</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-xs text-muted-foreground">Total Associates</p>
//               <p className="text-2xl font-bold mt-1">{mockAdminStats.totalAssociates}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-xs text-muted-foreground">Deal Close Rate</p>
//               <p className="text-2xl font-bold mt-1">{((mockAdminStats.closedDeals / (mockAdminStats.closedDeals + mockAdminStats.rejectedDeals + mockAdminStats.pendingDeals)) * 100).toFixed(1)}%</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <p className="text-xs text-muted-foreground">Avg Leads / Associate</p>
//               <p className="text-2xl font-bold mt-1">{(mockAdminStats.totalLeads / mockAdminStats.activeAssociates).toFixed(1)}</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Charts Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Monthly Leads vs Conversions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[280px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={monthlyLeadData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
//                     <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
//                     <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
//                     <Tooltip />
//                     <Bar dataKey="leads" fill="hsl(0, 0%, 15%)" radius={[4, 4, 0, 0]} name="Leads" />
//                     <Bar dataKey="converted" fill="hsl(0, 0%, 55%)" radius={[4, 4, 0, 0]} name="Converted" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Conversion Rate Trend</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[280px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={conversionTrend}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
//                     <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
//                     <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" unit="%" />
//                     {/* <Tooltip formatter={(value: number) => `${value}%`} /> */}
//                     <Line type="monotone" dataKey="rate" stroke="hsl(0, 0%, 9%)" strokeWidth={2} dot={{ r: 4 }} name="Rate" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Deal Breakdown + Associate Table */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Deal Status Breakdown</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[280px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={dealStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
//                       {dealStatusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Top Associates</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Leads</TableHead>
//                     <TableHead>Converted</TableHead>
//                     <TableHead>Closed</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {mockAssociates
//                     .sort((a, b) => b.stats.closedDeals - a.stats.closedDeals)
//                     .map((assoc) => (
//                       <TableRow key={assoc.id}>
//                         <TableCell className="font-medium">{assoc.fullName}</TableCell>
//                         <TableCell>{assoc.stats.totalLeads}</TableCell>
//                         <TableCell>{assoc.stats.convertedLeads}</TableCell>
//                         <TableCell>{assoc.stats.closedDeals}</TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={assoc.status === "active" ? "default" : assoc.status === "pending" ? "secondary" : "destructive"}
//                             className="capitalize"
//                           >
//                             {assoc.status}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//   );
// }
