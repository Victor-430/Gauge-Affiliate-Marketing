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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { isValidPhone } from "@/utils/validatePhoneNumber";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

export const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssociateFormData>({
    email: "",
    fullName: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);

  const handleViewPassword = () => {
    setIsView(!isView);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidPhone(formData.phone)) {
      toast.error("Invalid phone number", {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    // console.log("Creating User");

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

      let formatPhone = formData.phone.replace(/[\s\-+]/g, "");

      if (formatPhone.startsWith("+234")) {
        formatPhone = "0" + formatPhone.substring(4);
      }

      await setDoc(doc(db, "associates", user.uid), {
        email: formData.email,
        fullName: formData.fullName,
        phone: formatPhone,
        status: "pending",
        emailVerified: false,
        stats: {
          totalLeads: 0,
          convertedLeads: 0,
          closedDeals: 0,
          rejectedDeals: 0,
          pendingDeals: 0,
        },
        registrationDate: serverTimestamp(),
      });

      await sendEmailVerification(user);

      toast.success(
        "Account created. Please check your email to verify your account",
        { position: "top-right" },
      );

      navigate("/email-confirmation", {
        state: { fromSignup: true },
      });

      setFormData({ email: "", fullName: "", phone: "", password: "" });
    } catch (err) {
      // console.error(err);
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
          "Password must include: uppercase, lowercase, number, and symbol",
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
      // console.log("=== SUBMISSION ENDED ===");
    }
  };

  return (
    <div>
      <div className="min-h-[80vh] lg:min-h-screen flex items-center justify-center bg-gray-50  py-16">
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

            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>

              <Input
                type={isView ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-6"
                placeholder="Min. 6 characters"
              />
              {isView ? (
                <Eye
                  className="absolute right-4 top-11  w-5 h-5"
                  onClick={handleViewPassword}
                />
              ) : (
                <EyeOff
                  className=" absolute top-11  right-4 w-5 h-5"
                  onClick={handleViewPassword}
                />
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white  py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Registering...</p>
                </>
              ) : (
                <p>Register</p>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
