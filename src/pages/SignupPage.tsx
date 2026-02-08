import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/config/FirebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssociateFormData>({
    email: "",
    fullName: "",
    phone: "",
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
    console.log("Creating User");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const user = userCredential.user;
      const userName = formData.fullName.split(" ")[0];

      //  update user profile with the first name
      await updateProfile(user, {
        displayName: userName,
      });

      await setDoc(doc(db, "associates", user.uid), {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        status: "pending",
        emailVerified: false,
        stats: {
          totalLeads: 0,
          convertedLeads: 0,
          closeDeals: 0,
          rejectedDeals: 0,
          pendingDeals: 0,
        },
        registrationDate: serverTimestamp(),
      });

      await sendEmailVerification(user, {
        // url: "https://affiliate.gaugesolution/verify-success",
        url: "http://localhost:5173/verify-success",
      });

      toast.success(
        "Account created. Please check your email to verify your account",
        { position: "top-right" },
      );

      navigate("/email-confirmation", {
        state: { email: formData.email },
      });

      setFormData({ email: "", fullName: "", phone: "", password: "" });
    } catch (err) {
      console.error(err);
      if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/network-request-failed"
      ) {
        toast.error("Network error. Please try again.", {
          position: "top-right",
        });
      } else if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/email-already-in-use"
      ) {
        toast.error("Email already registered. Please  try again.", {
          position: "top-right",
        });
      } else if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/weak-password"
      ) {
        toast.error("Password should be at least 6 characters.", {
          position: "top-right",
        });
      } else if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/weak-password"
      ) {
        toast("Password should be at least 6 characters.", {
          position: "top-right",
        });
      } else if (
        err instanceof Error &&
        "code" in err &&
        err.code === "auth/password-does-not-meet-requirements"
      ) {
        toast.error(
          "Password must contain a lower case, an upper case,symbol and number",
          {
            position: "top-right",
          },
        );
      } else {
        toast.error("Registration failed. Please  try again.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
      console.log("=== SUBMISSION ENDED ===");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-16">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 font-Lato">
            Registration Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className=" text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-6"
                placeholder="John Doe"
              />
            </div>

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
                Phone Number
              </Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-6"
                placeholder="+1234567890"
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
                placeholder="Min. 6 characters"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white  py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
            >
              {loading ? "Registering..." : "Register "}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
