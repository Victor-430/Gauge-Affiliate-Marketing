import { Card } from "@/components/ui/card";
import { Link } from "react-router";

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Card className="text-xl text-black mb-10 max-w-lg mx-auto px-4">
          Sorry, you don't have permission to view this page.
        </Card>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
         
          <Link
            to="/login"
            className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-black/85 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};