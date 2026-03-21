import { createBrowserRouter } from "react-router";
import { SignupPage } from "@/pages/SignupPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { MainLayout } from "@/layouts/MainLayout";
import { SendVerificationPage } from "@/pages/SendVerificationPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { ReferralPage } from "@/pages/ReferralPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { ProtectedRoute } from "@/middleware/ProtectedRoute";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import AssociateDashboard from "@/pages/Associate-Dashboard/AssociateDashboard";
import AssociateLeads from "@/pages/Associate-Dashboard/AssociateLead";
import { DashboardLayout } from "@/pages/Associate-Dashboard/components/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
  // associate route
  {
    path: "/",
    element: <ProtectedRoute allowedRole="associate" />,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, Component: AssociateDashboard },
          { path: "leads", Component: AssociateLeads },
          {
            path: "submit-lead",
            Component: LeadsPage,
          },
        ],
      },
    ],
  },

  // admin route
  { path: "/admin", Component: AdminDashboard, children: [] },

  // public route
  {
    element: <MainLayout />,
    // loader: LoadingPage,
    children: [
      { path: "/signup", Component: SignupPage },
      {
        path: "/email-confirmation",
        Component: SendVerificationPage,
      },
      {
        path: "/verify-success",
        Component: VerificationPage,
      },

      {
        path: "/sales",
        Component: ReferralPage,
      },

      { path: "/login", Component: LoginPage },
    ],
  },

  { path: "/unauthorized", Component: UnauthorizedPage },
  { path: "*", Component: NotFoundPage },
]);
