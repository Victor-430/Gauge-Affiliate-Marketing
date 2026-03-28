import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const ErrorBoundaryPage = () => {
    const navigation = useNavigate()

  const handleBackButton = () => {
    navigation(-1);
  };

  const handleRefresh = () => {
 navigation(0);
  }

 return (
        <div className="min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-[120px] font-medium text-black leading-none tracking-tight">
            500
          </h1>
          <h2 className="text-2xl font-medium text-black mb-3">
            Something went wrong
          </h2>
          <p className="text-sm text-black max-w-xs leading-relaxed mb-10">
            An unexpected error occurred. Try refreshing or go back.
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              className=" bg-black text-white text-sm font-medium px-5 py-4 hover:opacity-85 transition-opacity"
            >
              Try again
            </Button>
            <Button
              onClick={handleBackButton}
              className=" bg-black text-white text-sm font-medium px-5 py-4 hover:border-white/40 transition-colors"
            >
              Go back
            </Button>
          </div>
        </div>
      );
}

