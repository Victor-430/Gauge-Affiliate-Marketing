import { Card } from "@/components/ui/card"
import { useLocation } from "react-router"

export const EmailConfirmationPage = () => {
const location = useLocation()
const email = location.state?.email 

    
  return (
    <div className="py-16">
        <Card className="w-3/4 mx-auto px-8 text-center font-sans py-8 pb-16 font-medium max-h-min">
            <img src="/public/gauge logo.png" alt="logo " className="h-20 w-30" />
               <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Click the link in the email to activate your account.
          </p>
          
        </Card>
    </div>
  )
}
