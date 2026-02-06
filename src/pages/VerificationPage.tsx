import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";

export const VerificationPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-center min-h-screen font-sans">
      <Card className="w-3/4 max-w-xl px-8 py-16">

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Verification successful
        </h2>

        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </Card>
    </div>
  );
};
