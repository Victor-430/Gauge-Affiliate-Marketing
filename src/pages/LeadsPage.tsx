import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export interface LeadForm {
  companyName: string;
  industry: string;
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  referralCode?: string;
}

export type LeadStatus = "new" | "converted";
export type DealStatus = "pending" | "closed" | "rejected";

export interface Lead {
  // Associate Information
  associateId: string;
  associateCode: string;
  associateName: string;
  associateEmail: string;

  // Company Information
  companyName: string;
  industry: string;

  // Contact Information
  contactFullName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;

  // Status Tracking
  leadStatus: LeadStatus;
  dealStatus: DealStatus | null;

  // Timestamps
  submittedAt: FirebaseFirestore.Timestamp;
  convertedAt?: FirebaseFirestore.Timestamp;
  dealClosedAt?: FirebaseFirestore.Timestamp;

  // Admin Actions
  adminNotes?: string;
  proposalSent?: boolean;
  proposalSentAt?: FirebaseFirestore.Timestamp;
}

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

  const ref = refCode.get("ref");

  useEffect(() => {
    // if link contains ref get code
    // verify code if it exists in database
    if (ref) {
      setFormData({ referralCode: "" });
    }
    // else update referral code based on the associate input also verify code exists
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormData({
      contactEmail: "",
      contactFullName: "",
      referralCode: "",
      contactPhone: "",
      companyName: "",
      contactRole: "",
      industry: "",
    });

    // get associate with the referral code
    // update associate with client details
    try {
      // await setDoc(doc(db, "leads", ))
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center mbb-8">
            <img src="/gauge-logo.png" className="w-20 mx-auto" alt="logo" />
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
              name="company name"
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
                  name="full name"
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
                  name="Role"
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
                  name="email"
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
                  name="phone"
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
                name="code"
                value={formData.referralCode}
                required
                placeholder="GAM1289FHK"
                onChange={handleChange}
                className={`w-full px-4 py-6 ${
                  isValidCode
                    ? "border-green-500 focus:ring-green-500"
                    : formData.referralCode && !isVerifyingCode
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                }`}
                disabled={isVerifyingCode}
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
