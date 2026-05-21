import { RouterProvider } from "react-router/dom";
import { router } from "./routes/index";
import { Toaster } from "./components/ui/sonner";
// import { AuthProvider } from "./context/loginAuthContext";

function App() {
  return (
    
<>
      <RouterProvider router={router} />
      <Toaster />

</>
    
    
  );
}

export default App;
