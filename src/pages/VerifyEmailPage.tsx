import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/config/FirebaseConfig";
import { useAuthActiviation } from "@/hooks/useAuthActivation";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  applyActionCode,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VerifyEmailPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // check if link has code else don't do anything and just check current user status
  // if verification page showed link expired or used and user resend verification email, i get failed to activate account from useAuth

  useAuthActiviation();

  useEffect(() => {
    const verifyEmailFromLink = async () => {
      const actionCode = searchParams.get("oobCode");
      const mode = searchParams.get("mode");

      if (actionCode && mode === "verifyEmail") {
        try {
          await applyActionCode(auth, actionCode);

          const user = auth.currentUser;
          if (user) {
            await user.reload();
            setIsVerified(true);
          } else {
            setVerificationError(
              "Please log in to complete email verification.",
            );
          }
        } catch (err) {
          // console.error("Error verifying email:", error);

          if (
            err instanceof Error &&
            "code" in err &&
            err.code === "auth/invalid-action-code"
          ) {
            setVerificationError(
              "This verification link is invalid or has already been used.",
            );
          } else if (
            err instanceof Error &&
            "code" in err &&
            err.code === "auth/expired-action-code"
          ) {
            setVerificationError(
              "This verification link has expired. Please request a new one.",
            );
          } else {
            setVerificationError(
              "Failed to verify email. Please try again or request a new link.",
            );
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        checkVerificationStatus();
      }
    };

    const checkVerificationStatus = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await user.reload();
          setIsVerified(user.emailVerified);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    verifyEmailFromLink();
  }, [searchParams]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        setIsVerified(user.emailVerified);

        if (user.emailVerified) {
          toast.success("Email verified successfully!", {
            position: "top-right",
          });
        } else {
          toast.info("Email not verified yet. Please check your inbox.", {
            position: "top-right",
          });
        }
      } else {
        toast.error("No user logged in", { position: "top-right" });
        navigate("/login");
      }
    } catch (error) {
      // console.error("Error refreshing status:", error);
      toast.error("Failed to check verification status", {
        position: "top-right",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", { replace: true });
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("No user logged in", { position: "top-right" });
      navigate("/login");
      return;
    }

    setIsResending(true);

    try {
      await sendEmailVerification(user);

      toast.success("Verification email sent. Please check your inbox.", {
        position: "top-right",
      });
    } catch (err) {
      // console.error("Error resending email:", error);

      if (err instanceof Error &&
        "code" in err &&
        err.code=== "auth/too-many-requests") {
        toast.error(
          "Too many requests. Please wait a few minutes before trying again.",
          {
            position: "top-right",
          },
        );
      } else {
        toast.error("Failed to resend email. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-sm text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">


    <div className="flex items-center justify-center min-h-[80vh] md:min-h-screen font-sans px-4">
      {isVerified ? (
        <Card className="w-full md:w-3/4 max-w-xl px-8 py-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center">
              <CheckCircle2 className="md:h-12 md:w-12 w-8 h-8 text-black" />
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Email Verified Successfully!
            </h2>

            <p className="text-gray-600 mb-6">
              Your account is now active. An email has been sent to your mail
            </p>

            <Button onClick={handleLogin} className="w-full">
              Continue to Login
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="w-full md:w-3/4 max-w-xl px-4 md:px-8 py-8 md:py-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center">
              <Mail className="md:h-12 md:w-12 w-8 h-8 text-black" />
            </div>

            <h2 className="text-lg md:text-2xl font-semibold mb-4">
              Verify Your Email Address
            </h2>

            {verificationError ? (
              <Alert variant="destructive" className="mb-6 text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  We've sent a verification email to{" "}
                  <strong className="text-gray-800">
                    {auth.currentUser?.email}
                  </strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Click the link in the email to verify your account.
                </p>
              </>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="default"
                className="w-full"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "I've Verified My Email"
                )}
              </Button>

              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Didn't receive the email? Check your spam folder or click resend.
            </p>
          </div>
        </Card>
      )}
    </div>
    </div>
  );
};
