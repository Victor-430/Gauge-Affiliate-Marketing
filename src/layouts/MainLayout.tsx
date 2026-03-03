import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Outlet, useMatch, useNavigate } from "react-router"

export const MainLayout = () => {
const navigation = useNavigate()

const handleBackButton = () => {
navigation(-1)
}

const isHome = useMatch("/")

  return (
    <div >
        <Navbar />
{!isHome && 
        <Button 
        onClick={handleBackButton}
        className="bg-black hover:bg-black/85 text-white font-sans mx-8 my-8 absolute "> <ArrowLeft className=""/> Back</Button>
}
        <Outlet />
    </div>
  )
}
