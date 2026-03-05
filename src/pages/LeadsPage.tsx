import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";


export const LeadsPage = () => {
  const [formData, setFormData] = useState<LeadForm>({
    contactEmail: "",
    contactFullName: "",
    contactRole: "",
    contactPhone: "",
    companyName: "",
    industry: "",
    referralCode: "",
  });
  const [isloading, setIsLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [refCode] = useSearchParams();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasVerifiedUrlCode = useRef(false);

  const ref = refCode.get("ref");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const verifyReferralCode = useCallback(async (code: string) => {
    if (!code || code.trim() === "") {
      setIsValidCode(false);
      return;
    }

    setIsVerifyingCode(true);
    try {
      const associatesRef = collection(db, "associates");
      const q = query(associatesRef, where("uniqueCode", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsValidCode(true);
        toast.success("Valid referral code", { position: "top-right" });
      } else {
        // console.log("code ran 1");
        setIsValidCode(false);
        toast.error("Invalid referral code. Please check and try again", {
          position: "top-right",
        });
        // console.log("code ran 2");
      }
    } catch (error) {
      // console.error("Error verifying code:", error);
      toast.error("Failed to verify referral code", {
        position: "top-right",
      });
      setIsValidCode(false);
    } finally {
      setIsVerifyingCode(false);
    }
  }, []);

  useEffect(() => {
    if (ref && !hasVerifiedUrlCode.current) {
      hasVerifiedUrlCode.current = true;
      setFormData((prev) => ({ ...prev, referralCode: ref }));
      verifyReferralCode(ref);
    }
  }, [ref, verifyReferralCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (ref) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      referralCode: value,
    }));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsValidCode(false);

    if (value.length >= 10) {
      debounceTimer.current = setTimeout(() => {
        verifyReferralCode(value);
      }, 500);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // console.log("Submitting:", formData);

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
          referralCode: formData.referralCode,
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
      setIsValidCode(false);
      hasVerifiedUrlCode.current = false;
      // console.log("Form Submitted")
    } catch (error) {
      // console.error("Submit error:", error);
      toast.error("Failed to submit lead", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center mbb-8">
            <img src="/gauge-logo-dark.png" className="w-20 mx-auto" alt="logo" />
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

          {/*referral section */}
          <div>
            <Label className=" text-sm font-medium text-gray-700 mb-2">
              Referral Code
            </Label>
            <div className="relative">
              <Input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                required
                placeholder="GAM1289FHK"
                onChange={handleReferralCodeChange}
                className={`w-full px-4 py-6 ${
                  isValidCode
                    ? "border-green-500 focus:ring-green-500"
                    : formData.referralCode && !isVerifyingCode
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                }`}
                disabled={isVerifyingCode || !!ref}
              />
              {isVerifyingCode && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
              )}
              {!isVerifyingCode && formData.referralCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidCode ? (
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
            {!isValidCode && formData.referralCode && !isVerifyingCode && (
              <p className="text-xs text-red-500 mt-1">
                Invalid referral code.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isloading || isVerifyingCode || !isValidCode}
            className="w-full bg-black text-white py-6 font-semibold hover:bg-black/85 disabled:bg-gray-400 transition"
          >
            {isloading ? "Submitting" : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};
