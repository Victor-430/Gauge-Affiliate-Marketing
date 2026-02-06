import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/config/FirebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";

export const SignupPage = () => {
  const [formData, setFormData] = useState<AssociateFormData>({
    email: "",
    fullName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    (e.preventDefault, setLoading(true));
    toast.success("Submission successful");

    console.log("=== STARTING SUBMISSION ===");
  console.log("Form Data:", formData);
  console.log("DB Instance:", db);

    try {
         console.log("Creating document...");

      const docRef = await addDoc(collection(db, "associates"), {
        
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        status: "pending",
        stats: {
          totalLeads: 0,
          convertedLeads: 0,
          closeDeals: 0,
          rejectedDeals: 0,
          pendingDeals: 0,
        },
        registrationDate: serverTimestamp(),
      });

        console.log("✅ SUCCESS! Document ID:", docRef.id);
    console.log("Document Path:", docRef.path);

      toast.success(
        "Registration successful. Check your email for your unique link and code",
      );
      setFormData({ email: "", fullName: "", phone: "" });
    } catch (err) {
      console.error(err);

      
    
      toast.error("Registration failed. Please  try again.");
    } finally {
      setLoading(false);
        console.log("=== SUBMISSION ENDED ===");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans ">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 font-Lato">
            Sales Associate Registration
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white  py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
            >
              {loading ? "Registering..." : "Register "}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
