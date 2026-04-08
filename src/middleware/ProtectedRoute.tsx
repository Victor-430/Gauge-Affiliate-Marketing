import { Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/context/loginAuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { auth } from "@/config/FirebaseConfig";

interface ProtectedRouteProps {
  allowedRole: "admin" | "associate";
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, role, loading, logout } = useAuth();
  const hasShownUnauthorized = useRef(false);
  const hasShownWelcome = useRef(false);
  const hasShownEmailVerification = useRef(false);
  const navigate = useNavigate();

  const emailVerified = user?.emailVerified;

  useEffect(() => {
    if (!user) {
      hasShownWelcome.current = false;
      hasShownUnauthorized.current = false;
      hasShownEmailVerification.current = false;
    }
  }, [user]);

  useEffect(() => {
    const handleUnverifiedEmail = async() => {

      if (user && !emailVerified && !hasShownEmailVerification.current) {
        hasShownEmailVerification.current = true;
        toast.error("Please verify your email before logging in.", {
          position: "top-right",
        });
        await logout()
        navigate("/email-confirmation");
      }

    }

    handleUnverifiedEmail()
  }, [user, emailVerified, logout]);

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
  }, [loading, user, role, allowedRole, emailVerified]);

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
  }, [loading, user, role, allowedRole, emailVerified]);

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
