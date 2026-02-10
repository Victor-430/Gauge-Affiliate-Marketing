import { createBrowserRouter } from "react-router";
import { SignupPage } from "@/pages/SignupPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminPage } from "@/pages/dashboard/AdminPage";
import { MainLayout } from "@/layouts/MainLayout";
import { AssociatesPage } from "@/pages/dashboard/AssociatesPage";
import { HomePage } from "@/pages/HomePage";
import { SendVerificationPage } from "@/pages/SendVerificationPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { ReferralPage } from "@/pages/ReferralPage";
import { LoginPage } from "@/pages/LoginPage";

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
      { path: "/login", Component: LoginPage },
    ],
  },

  {
    path: "/admin/dashboard",
    
    Component: AdminPage,
  },
  {
    path: "/associate/dashboard",
    Component: AssociatesPage,
  },
  { path: "/login", Component: LoginPage },
  { path: "*", Component: NotFoundPage },
]);
