import { RouterProvider } from "react-router/dom";
import { router } from "./routes/index";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/loginAuthContext";

function App() {
  return (
    
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
    
  );
}

export default App;
