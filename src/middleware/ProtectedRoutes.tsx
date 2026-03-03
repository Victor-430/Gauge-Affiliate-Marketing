import { Navigate } from "react-router";
import { useAuth } from "@/context/loginAuthContext"; 
import { Loader2 } from "lucide-react";


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: "admin" | "associate"
}

export const ProtectedRoutes = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && !allowedRoles) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};