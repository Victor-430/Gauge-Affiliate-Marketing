import { createBrowserRouter } from "react-router";
import { SignupPage } from "@/pages/SignupPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminPage } from "@/pages/login/AdminPage";
import { MainLayout } from "@/layouts/MainLayout";
import { AssociatesPage } from "@/pages/login/AssociatesPage";
import { HomePage } from "@/pages/HomePage";
import { SendVerificationPage } from "@/pages/SendVerificationPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { ReferralPage } from "@/pages/ReferralPage";

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

  {
    path: "/admin",
    Component: AdminPage,
  },
  {
    path: "/associate",
    Component: AssociatesPage,
  },
  { path: "*", Component: NotFoundPage },
]);
