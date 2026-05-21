import { auth, db } from "@/config/FirebaseConfig";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const retryPendingSignup = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (localStorage.getItem("pendingFirestoreSetup")) {
    try {
      const docSnap = await getDoc(doc(db, "associates", user.uid));
      if (!docSnap.exists()) {
        await setDoc(doc(db, "associates", user.uid), {
          email: user.email,
          fullName: user.displayName ?? "",
          phone: "",
          status: "pending",
          emailVerified: user.emailVerified,

          registrationDate: serverTimestamp(),
        });
      }
      localStorage.removeItem("pendingFirestoreSetup"); 
    } catch(err) {
      console.error(err)
    }
  }

  if (localStorage.getItem("pendingProfileSetup")) {
    try {
      if (!user.displayName) {
        await updateProfile(user, {
          displayName: user.email?.split("@")[0] ?? "User",
        });
      }
      localStorage.removeItem("pendingProfileSetup");
    }  catch(err) {
      console.error(err)
    }
  }

  if (localStorage.getItem("pendingEmailVerification")) {
    try {
      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }
      localStorage.removeItem("pendingEmailVerification");
    } catch(err) {
      console.error(err)
    }
  }
};