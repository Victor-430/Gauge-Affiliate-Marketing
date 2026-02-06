import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Outlet, useNavigate } from "react-router"

export const MainLayout = () => {
const navigation = useNavigate()

const handleBackButton = () => {
navigation("/")
}

  return (
    <div className="bg-gray-50" >
        <Navbar />
        {/* prev button */}
        <Button 
        onClick={handleBackButton}
        className="bg-black hover:bg-black/85 text-white font-sans mx-8 my-8 "> <ArrowLeft className=""/> Back</Button>
        <Outlet />
    </div>
  )
}
