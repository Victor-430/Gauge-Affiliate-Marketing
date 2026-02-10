import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/config/FirebaseConfig";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Check if email is verified (skip for admin)
      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.", {
          position: "top-right",
        });
        navigate("/verify-success");
        return;
      }

      const idToken = await getIdToken(user);

      // Get user role from backend
      const response = await fetch(`${API_URL}/api/auth/get-user-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!data?.success) {
        toast.error(data?.error , {
          position: "top-right",
        });
        return;
      }

      

      toast.success("Login successful!", { position: "top-right" });

      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "associate") {
        navigate("/associate/dashboard");
      } else {
        toast.error("Invalid user role", { position: "top-right" });
      }

    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password", { position: "top-right" });
      } else if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email", {
          position: "top-right",
        });
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password", { position: "top-right" });
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.", {
          position: "top-right",
        });
      } else {
        toast.error("Login failed. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-6"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-6"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};