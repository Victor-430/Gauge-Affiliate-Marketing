import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const NotFoundPage = () => {
 const navigation = useNavigate()

  const handleBackButton = () => {
    navigation(-1);
  };

  return (
    <div className="min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[120px] font-medium text-black leading-none tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-medium text-black mb-3">Page not found</h2>
      <p className="text-sm text-black  leading-relaxed mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleBackButton}
        className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
      >
       <ChevronLeft />
        Go back
      </button>
    </div>
  );
}

