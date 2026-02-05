import { createBrowserRouter } from "react-router";
import HomePage from "../pages/Homepage";
import { SignupPage } from "@/pages/SignupPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminPage } from "@/pages/AdminPage";
import { MainLayout } from "@/layouts/MainLayout";

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
        path: "/leads",
        Component: LeadsPage,
      },
    ],
  },

  {
    path: "/admin",
    Component: AdminPage,
  },
  { path: "*", Component: NotFoundPage },
]);
