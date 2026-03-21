import { useMatch, useNavigate } from "react-router";
import { Button } from "../ui/button";

export const Navbar = () => {
  const navigation = useNavigate();
  const isSignupPage = useMatch("/signup");
  const isVerifySuccess = useMatch("/verify-success")
  const isEmailConfirmation = useMatch("/email-confirmation")

  const handleLogin = () => {
    navigation("/login");
  };
  const handleSignup = () => {
    navigation("/signup");
  };

  return (
    <div className="w-full h-16 bg-primary font-sans text-white flex items-center py-2 justify-between px-8  ">
      <img
        src="/Gauge logo-white.png"
        alt="logo"
        className="bg-transparent w-24 "
      />

      { !isVerifySuccess && !isEmailConfirmation &&
        (isSignupPage ? (
          <Button
            onClick={handleLogin}
            className="bg-white text-black items-center hover:bg-white/85  "
          >
            Login
          </Button>
        ) : (
          <Button
            onClick={handleSignup}
            className="bg-white text-black items-center hover:bg-white/85 "
          >
            Signup
          </Button>
        ))}
    </div>
  );
};
