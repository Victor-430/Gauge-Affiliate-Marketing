import { auth } from "@/config/FirebaseConfig";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthActiviation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authStateChange = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        try {
          const idToken = await getIdToken(user);
          // console.log(idToken);
          const response = await fetch(`${API_URL}/associate/activate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            // console.error(data.error);
            toast("An error occurred during activation", {
              position: "top-right",
            });
          }

          if (data.success) {
            toast(data?.message, { position: "top-right" });
            // console.log("Account activated!", data);
            navigate("/");
          }
        } catch (error) {
          // console.error("Error activating account:", error);
          toast("An error occurred during activation", {
            position: "top-right",
          });
        }
      }
    });

    return () => authStateChange();
  }, [navigate]);
};
