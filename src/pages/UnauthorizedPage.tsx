import { Link } from "react-router";

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-red-600 mb-6">403</h1>
        <h2 className="text-4xl font-semibold mb-4">Unauthorized Access</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
          Sorry, you don't have permission to view this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
         
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};