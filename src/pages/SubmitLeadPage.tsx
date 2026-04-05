import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/config/FirebaseConfig";
import { doc, getDoc} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SubmitLeadPage = () => {
  const [formData, setFormData] = useState<LeadForm>({
    contactEmail: "",
    contactFullName: "",
    contactRole: "",
    contactPhone: "",
    companyName: "",
    industry: "",
  });
  const [isloading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userId = auth.currentUser?.uid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!userId) {
      toast.error("You must be logged in to submit a lead", {
        position: "top-right",
      });
      setIsLoading(false);
      return;
    }
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // console.log("Submitting:", formData);

      const associateId = doc(db, "associates", userId!);
      const querySnapshot = await getDoc(associateId);
      if (!querySnapshot.exists()) {
        toast.success("An error occurred while submitting the lead", {
          position: "top-right",
        });
        return;
      }

      setIsLoading(true);

      const res = await fetch(`${API_URL}/leads/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactEmail: formData.contactEmail,
          contactFullName: formData.contactFullName,
          contactRole: formData.contactRole,
          contactPhone: formData.contactPhone,
          companyName: formData.companyName,
          industry: formData.industry,
          userId,
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        toast.error(data?.error || "Failed to submit lead", {
          position: "top-right",
        });
        return;
      }

      toast.success("Lead submitted successfully", {
        position: "top-right",
      });

      setFormData({
        contactEmail: "",
        contactFullName: "",
        referralCode: "",
        contactPhone: "",
        companyName: "",
        contactRole: "",
        industry: "",
      });
    } catch (error) {
      // console.error("Submit error:", error);
      toast.error("Failed to submit lead", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center mbb-8">
            <img
              src="/gauge-logo-dark.png"
              className="w-20 mx-auto"
              alt="logo"
            />
            <p className="text-sm text-gray-600 mt-2">
              Fill out the form to get started
            </p>
          </div>

          {/* company information */}
          <div>
            <Label className=" text-sm font-medium text-gray-700 mb-2">
              Company Name
            </Label>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              required
              placeholder="Gauge"
              onChange={handleChange}
              className="w-full px-4 py-6"
            />
          </div>
          <div>
            <Label className=" text-sm font-medium text-gray-700 mb-2">
              Industry
            </Label>
            <Input
              placeholder="IOT, Technology, Healthcare"
              type="text"
              name="industry"
              value={formData.industry}
              required
              onChange={handleChange}
              className="w-full px-4 py-6"
            />
          </div>

          {/* contact info */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label className=" text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="contactFullName"
                  value={formData.contactFullName}
                  required
                  placeholder="John"
                  onChange={handleChange}
                  className="w-full px-4 py-6"
                />
              </div>
              <div>
                <Label className=" text-sm font-medium text-gray-700 mb-2">
                  Role/Title
                </Label>
                <Input
                  type="text"
                  name="contactRole"
                  value={formData.contactRole}
                  required
                  placeholder="Manager"
                  onChange={handleChange}
                  className="w-full px-4 py-6"
                />
              </div>
              <div>
                <Label className=" text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  required
                  placeholder="john@example.com"
                  onChange={handleChange}
                  className="w-full px-4 py-6"
                />
              </div>
              <div>
                <Label className=" text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  required
                  placeholder="+234 8903838"
                  onChange={handleChange}
                  className="w-full px-4 py-6"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isloading}
            className="w-full bg-black text-white py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
          >
            {isloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <p>Submitting</p>
              </>
            ) : (
              <p>Submit</p>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
