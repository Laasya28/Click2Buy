import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { serverUrl } from "../../../admin/config";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import Container from "../components/Container";

const SignUp = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = "user"; // Fixed role as user, not editable

  // ============= Error Messages =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Event Handlers =============
  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  // ================= Email Validation =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!checked) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    // Reset errors
    setErrClientName("");
    setErrEmail("");
    setErrPassword("");

    let hasError = false;

    if (!clientName) {
      setErrClientName("Enter your full name");
      hasError = true;
    }

    if (!email) {
      setErrEmail("Enter your email");
      hasError = true;
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setErrPassword("Create a password");
      hasError = true;
    } else if (password.length < 6) {
      setErrPassword("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/api/user/register`, {
        name: clientName,
        email,
        password,
        role, // Always "user"
      });
      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        navigate("/signin");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("User registration error", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900"
      style={{
        backgroundImage: `url('/client_signup_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[550px] px-6 py-12"
      >
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Decorative shine effect */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-10" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-white/60 text-sm font-medium">
              Join Click2Buy for a premium shopping journey
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <FaUser className="text-white/40 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  value={clientName}
                  onChange={handleName}
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl py-4 pl-14 pr-5 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-sm font-medium backdrop-blur-sm"
                />
              </div>
              {errClientName && (
                <p className="text-red-300 text-[11px] font-bold px-2 tracking-wide uppercase">
                  {errClientName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <FaEnvelope className="text-white/40 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl py-4 pl-14 pr-5 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-sm font-medium backdrop-blur-sm"
                />
              </div>
              {errEmail && (
                <p className="text-red-300 text-[11px] font-bold px-2 tracking-wide uppercase">
                  {errEmail}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <FaLock className="text-white/40 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePassword}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl py-4 pl-14 pr-14 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-sm font-medium backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-5 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errPassword && (
                <p className="text-red-300 text-[11px] font-bold px-2 tracking-wide uppercase">
                  {errPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-3 px-1 pt-2">
              <div
                onClick={() => setChecked(!checked)}
                className={`w-5 h-5 rounded-lg border border-white/20 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${checked ? 'bg-white border-white' : 'bg-transparent hover:border-white/40'}`}
              >
                {checked && <div className="w-2.5 h-2.5 bg-slate-900 rounded-[2px]" />}
              </div>
              <p className="text-white/60 text-[11px] leading-snug select-none">
                I agree to the <span className="text-white font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-white font-bold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: checked ? 1.02 : 1 }}
              whileTap={{ scale: checked ? 0.98 : 1 }}
              type="submit"
              disabled={!checked || isLoading}
              className={`w-full relative h-14 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] shadow-xl shadow-black/20 transition-all group overflow-hidden ${checked ? 'bg-white text-slate-900 hover:bg-slate-50' : 'bg-white/20 text-white/40 cursor-not-allowed border border-white/10'}`}
            >
              {checked && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-white/50 text-xs font-medium">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-white font-bold hover:underline underline-offset-4 decoration-white/30 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
