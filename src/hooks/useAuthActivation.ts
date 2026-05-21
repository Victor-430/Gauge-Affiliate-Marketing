import { auth, db } from "@/config/FirebaseConfig";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthActiviation = () => {
  const hasActivated = useRef(false);

  useEffect(() => {
    const authStateChange = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      await user.reload();
      if (!user.emailVerified) return;
      if (hasActivated.current) return;
      try {
        const associateDoc = await getDoc(doc(db, "associates", user.uid));
        const associate = associateDoc.data();

        if (associate?.status === "active" && associate?.uniqueCode) return;

        hasActivated.current = true;

        const idToken = await getIdToken(user, true);
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
          hasActivated.current = false;
          toast.error("Failed to send welcome email", {
            position: "top-right",
          });
        }

        if (data.success) {
          toast.success(data?.message, { position: "top-right" });
          // console.log("Account activated!", data);
        }
      } catch (error) {
        // console.error("Error activating account:", error);
        hasActivated.current = false;
        toast.error("An error occurred during activation", {
          position: "top-right",
        });
      }
    });

    return () => authStateChange();
  }, []);
};
