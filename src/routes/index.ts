import { createBrowserRouter } from "react-router";
import { SignupPage } from "@/pages/SignupPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { MainLayout } from "@/layouts/MainLayout";

import { SendVerificationPage } from "@/pages/SendVerificationPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { ReferralPage } from "@/pages/ReferralPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
// import {  ProtectedRoutes } from "@/middleware/ProtectedRoutes";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import AssociateDashboard from "@/pages/Associate-Dashboard/AssociateDashboard";
import AssociateLeads from "@/pages/Associate-Dashboard/AssociateLead";
import HomePage from "@/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,

    children: [
      { index: true, Component: HomePage },
      {
        path: "/signup",
        Component: SignupPage,
      },
      {
        path: "/email-confirmation",
        Component: SendVerificationPage,
      },
      {
        path: "/verify-success",
        Component: VerificationPage,
      },
      {
        path: "/leads",
        Component: LeadsPage,
      },
      {
        path: "/sales",
        Component: ReferralPage,
      },
    ],
  },

// {
//   path: "/admin/dashboard",
//   element: (
//     <ProtectedRoutes allowedRoles="admin">
//       <AdminDashboard />
//     </ProtectedRoutes>
//   ),
// },
//   {
//     path: "/associate/dashboard",
//     element:(<ProtectedRoutes allowedRoles = "associate">
//       <AssociateDashboard />
//       </ProtectedRoutes>)
    
//   },

{path:"/associate/dashboard",
  Component:AssociateDashboard,
 
},
{path:"/associate/leads",
  Component:AssociateLeads
},
{path:"/admin/dashboard",
  Component:AdminDashboard
},
  // { path: "/login", Component: LoginPage },
  { path: "/unauthorized", Component: UnauthorizedPage },

  { path: "*", Component: NotFoundPage },
]);
