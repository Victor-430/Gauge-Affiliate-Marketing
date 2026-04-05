import { createBrowserRouter } from "react-router";
import { SignupPage } from "@/pages/SignupPage";
import { SubmitLeadPage } from "@/pages/SubmitLeadPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { MainLayout } from "@/layouts/MainLayout";
import { EmailConfirmationPage } from "@/pages/EmailConfirmationPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { ReferralPage } from "@/pages/ReferralPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { ProtectedRoute } from "@/middleware/ProtectedRoute";
import { AdminDashboard } from "@/pages/dashboards/admin/AdminDashboard";
import AssociateDashboard from "@/pages/dashboards/associate/AssociateDashboard";
import AssociateLeads from "@/pages/dashboards/associate/AssociateLead";
import { DashboardLayout } from "@/pages/dashboards/components/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { ErrorBoundaryPage } from "@/pages/ErrorBoundaryPage";

export const router = createBrowserRouter([
  // associate route
  {
    path: "/",
    element: <ProtectedRoute allowedRole="associate" />,
    ErrorBoundary: ErrorBoundaryPage,
    children: [
      {
        element: <DashboardLayout role="associate" />,
        children: [
          { index: true, Component: AssociateDashboard },
          { path: "leads", Component: AssociateLeads },
          {
            path: "submit-lead",
            Component: SubmitLeadPage,
          },
        ],
      },
    ],
  },

  // admin route
  {
    path: "/admin",
    // element: <ProtectedRoute allowedRole="admin" />,
    ErrorBoundary: ErrorBoundaryPage,
    children: [
      {
        element: <DashboardLayout role="admin" />,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "/admin/leads", Component: AdminDashboard },

          { path: "/admin/reports", Component: AdminDashboard },
        ],
      },
    ],
  },

  // public route
  {
    element: <MainLayout />,
    ErrorBoundary: ErrorBoundaryPage,
    // loader: LoadingPage,
    children: [
      { path: "/signup", Component: SignupPage },
      {
        path: "/email-confirmation",
        Component: EmailConfirmationPage,
      },
      {
        path: "/verify-success",
        Component: VerificationPage,
      },
      { path: "/referral", Component: ReferralPage },

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
