import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/loginAuthContext"; 
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";


interface ProtectedRouteProps {
  allowedRole: "admin" | "associate"
}

export const ProtectedRoute = ({  allowedRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const hasShownUnauthorized = useRef(false);
  const hasShownWelcome = useRef(false);

//  useEffect(() => {
//     if (!user) {
//       hasShownUnauthorized.current = false;
//       hasShownWelcome.current = false;
//     }
//   }, [user]);

  // console.log("🛡️ ProtectedRoute render:", { 
  //   user: !!user, 
  //   role, 
  //   loading,
  //   allowedRole,
  //   timestamp: new Date().toISOString()
  // });

  useEffect(() => {
    if (!loading && user && role && role !== allowedRole && !hasShownUnauthorized.current) {
      hasShownUnauthorized.current = true;
      toast.error("You don't have permission to access this page", {
        position: "top-right",
      });
    }
  }, [loading, user, role, allowedRole]);

  useEffect(() => {
    if (!loading && user && role && role === allowedRole && !hasShownWelcome.current) {
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

  if (role !== allowedRole) {
    // console.log(allowedRole)
    // console.log(role)
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />
};