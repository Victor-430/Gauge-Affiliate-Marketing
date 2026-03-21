import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/config/FirebaseConfig";
import { useAuthActiviation } from "@/hooks/useAuthActivation"; 
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const VerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useAuthActiviation( )

  useEffect(() => {
    const checkStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        //  Reload user to get latest emailVerified status
        await user.reload();
        setIsVerified(user.emailVerified);
      }
      setIsLoading(false)
    };

    checkStatus();
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

    const handleRefresh = async () => {
      //  console.log("Refresh button clicked");
    setIsRefreshing(true);
    const user = auth.currentUser;
    if (user) {
      //  console.log("Email verified before reload:", user.emailVerified);
      await user.reload();
      setIsVerified(user.emailVerified);
      //  console.log("Email verified after reload:", user.emailVerified);
    }
    setIsRefreshing(false);
  };

   if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  min-h-screen font-sans">
      {isVerified ? (
        <Card className="w-[85%] md:w-3/4 max-w-xl px-8 py-16">
          <h2 className="text-md md:text-2xl font-semibold mb-4 text-center">
            Verification Successful
          </h2>

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </Card>
      ) : (
        <Card className="w-[85%] md:w-3/4 max-w-xl px-4 md:px-8 py-8 md:py-16 text-center">
         

           <h2 className="text-lg md:text-2xl font-semibold mb-4">
            Please Verify Your Email
          </h2>
          <p className="text-gray-600 mb-2">
            We've sent a verification email to
            <strong>{auth.currentUser?.email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click the link in the email to verify your account.
          </p>
        <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="w-full"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <p className="px-4">
                "I've Verified My Email (Refresh)"

              </p>
            )}
          </Button>
        </Card>
      )}
    </div>
  );
};
