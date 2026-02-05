import { Navbar } from "@/components/layout/Navbar"
import { Outlet } from "react-router"

export const MainLayout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}
