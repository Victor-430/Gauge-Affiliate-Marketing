import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/config/FirebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import {useNavigate } from "react-router";
import { toast } from "sonner";

export const EmailConfirmationPage = () => {
  // const location = useLocation();
  // const fromSignup = location?.state?.fromSignup === true;
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const user = auth.currentUser;
  const userEmail = user?.email ?? "";
  // const [emailSent, setEmailSent] = useState(false);

  const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

  // useEffect(() => {
  //   const shouldAutoSend =
  //     user && !user.emailVerified && !emailSent && !fromSignup;

  //   if (!shouldAutoSend) return;

  //   const autoSend = async () => {
  //     try {
  //       setEmailSent(true);
  //       await sendEmailVerification(user, {
  //         url: `${CLIENT_URL}/verify-success`,
  //       });
  //       toast.success("Verification email has been sent to your inbox", {
  //         position: "top-right",
  //       });
  //     } catch (err) {
  //       setEmailSent(false);
  //       if (
  //         err instanceof Error &&
  //         "code" in err &&
  //         err.code === "auth/too-many-requests"
  //       ) {
  //         toast.info(
  //           "Verification email was already sent recently. Please check your inbox/spam.",
  //           {
  //             position: "top-right",
  //           },
  //         );
  //       } else {
  //         // console.error(err);
  //         toast.error(
  //           "Failed to send verification email. Click the resend button",
  //         );
  //       }
  //     }
  //   };

  //   autoSend();
  // }, [user, fromSignup, emailSent]);

  const handleEmailResend = async () => {
    if (!user) {
      toast.error("User not found. Please sign up again.", {
        position: "top-right",
      });
      navigate("/signup");
      return;
    }

    setResending(true);
    try {
      // setEmailSent(true);
      await sendEmailVerification(user, {
        url: `${CLIENT_URL}/verify-success`,
      });
      toast.success("Verification Email Resent", { position: "top-right" });
    } catch (err) {
      // setEmailSent(false);
      if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/too-many-requests"
      ) {
        toast.info(
          "Verification email was already sent recently. Please check your inbox/spam.",
          {
            position: "top-right",
          },
        );
      } else {
        // console.error("Error resending email:", error);
        toast.error("Failed to resend email. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="mt-8 py-12 md:py-16">
      <Card className="w-[85%] md:w-3/4 mx-auto px-4 md:px-8 text-center font-sans py-8 pb-8 md:pb-16 font-medium max-h-min">
        <img src="/gauge-logo-dark.png" alt="logo " className="w-20 md:w-30" />
        <p className="text-gray-600 text-sm sm:text-lg md:text-2xl font-semibold mt-4 md:mt-10 mb-2 md:mb-6">
          We've sent a verification email to <strong>{userEmail}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-2 md:mb-8">
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
  );
};
