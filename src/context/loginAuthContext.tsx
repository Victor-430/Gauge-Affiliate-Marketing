import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken, type User } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate()

  useEffect(() => {
    const authState = onAuthStateChanged(auth, async (firebaseUser) => {
      const emailVerified = firebaseUser?.emailVerified;
      console.log(emailVerified)
      
      setLoading(true);

      if (firebaseUser) {
        // console.log("logged in user: ", firebaseUser);
        setUser(firebaseUser);

        try {
          const idToken = await getIdToken(firebaseUser, true);
          // console.log("Token:", idToken);

          if (!idToken) {
            // console.error("Failed to get token - logging out");
            await auth.signOut();
            setUser(null);
            setUserData(null);
            setRole(null);
            setLoading(false);
            return;
          }

          const response = await fetch(`${API_URL}/role/get-role`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            // console.error(
            //   `API Error: ${response.status} ${response.statusText}`,
            // );
            await auth.signOut();
            setUser(null);
            setUserData(null);
            setRole(null);
            setLoading(false);
            return;
          }

          const data = await response.json();

          if (data.success) {
            setUserData(data.user);
            setRole(data.role);
            setLoading(false);
          }
        } catch (error) {
          // console.error("Error fetching user data:", error);
          await auth.signOut();
          setUser(null);
          setUserData(null);
          setRole(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => authState();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
