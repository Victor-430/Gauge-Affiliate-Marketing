import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { auth } from "@/config/FirebaseConfig"
import { sendEmailVerification } from "firebase/auth"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

export const SendVerificationPage = () => {
const location = useLocation()
const email = location?.state?.email
const navigate = useNavigate()
const [resending, setResending] = useState(false)
const user = auth.currentUser

const handleEmailResend = async() => {
  if (!user) {
      toast.error("User not found. Please sign up again.", {
        position: "top-right",
      });
      navigate("/signup");
      return;
    }

    setResending(true)
     try {
      await sendEmailVerification(user, {
                // url: "https://affiliate.gaugesolution/verify-success",
        url: "http://localhost:5173/verify-success",
      });
      toast.success("Verification Email Resent", { position: "top-right" });
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Failed to resend email. Please try again.", {
        position: "top-right",
      });
    } finally {
      setResending(false);
    }

     if (!email || !user) {
    navigate("/signup");
    return null;
  }
  };
  return (
    <div className="py-16">
        <Card className="w-3/4 mx-auto px-8 text-center font-sans py-8 pb-16 font-medium max-h-min">
            <img src="/gauge-logo.png" alt="logo " className=" w-30" />
               <p className="text-gray-600 text-2xl font-semibold mb-6">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Click the link in the email to activate your account.
          </p>
          
           <div className="space-y-4">
          <Button
            onClick={handleEmailResend}
            disabled={resending}
            variant="outline"
            className="w-full"
          >
            {resending ? "Resending..." : "Resend Verification Email"}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or click resend.
          </p>
        </div>
        </Card>
    </div>
  )
}
    

