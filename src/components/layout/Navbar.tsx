import { useNavigate } from "react-router"
import { Button } from "../ui/button"

export const Navbar = () => {
const navigation = useNavigate()

const handleAdminLogin = () => {
navigation("/admin")
}

  return (
    <div className="w-full h-16 bg-primary font-sans text-white flex justify-between px-8 py-2 ">
      <img src="/Gauge logo-white.png" alt="logo" className="bg-transparent " />

      <Button 
      onClick={handleAdminLogin}
      className="bg-white text-black items-center hover:bg-white/85 py-4 ">Login</Button>

    </div>
  )
}
