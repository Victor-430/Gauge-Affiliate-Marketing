import { Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/context/loginAuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRole: "admin" | "associate";
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const hasShownUnauthorized = useRef(false);
  const hasShownWelcome = useRef(false);
  const hasShownEmailVerification = useRef(false);
  const navigate = useNavigate();

  console.log(user?.emailVerified);

  const emailVerified = user?.emailVerified;

  useEffect(() => {
    if (user && !emailVerified && !hasShownEmailVerification.current) {
      hasShownEmailVerification.current = true;
      toast.error("Please verify your email before logging in.", {
        position: "top-right",
      });
      navigate("/email-confirmation", { state: { email: user.email } });
    }
  }, [user, emailVerified]);

  // console.log("🛡️ ProtectedRoute render:", {
  //   user: !!user,
  //   role,
  //   loading,
  //   allowedRole,
  //   timestamp: new Date().toISOString()
  // });

  useEffect(() => {
    if (
      !loading &&
      user &&
      role &&
      emailVerified &&
      role !== allowedRole &&
      !hasShownUnauthorized.current
    ) {
      hasShownUnauthorized.current = true;
      toast.error("You don't have permission to access this page", {
        position: "top-right",
      });
    }
  }, [loading, user, role, allowedRole]);

  useEffect(() => {
    if (
      !loading &&
      user &&
      emailVerified &&
      role &&
      role === allowedRole &&
      !hasShownWelcome.current
    ) {
      hasShownWelcome.current = true;
      toast.success("Login successful!", {
        position: "top-right",
      });
    }
  }, [loading, user, role, allowedRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!emailVerified) {
    return (
      <Navigate
        to="/email-confirmation"
        state={{ email: user.email }}
        replace
      />
    );
  }
  if (role !== allowedRole) {
    // console.log(allowedRole)
    // console.log(role)
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
