import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";
import { useDispatch } from "react-redux";
import { setOrderCount } from "../redux/orebiSlice";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaArrowRight,
} from "react-icons/fa";
import Container from "../components/Container";

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  // Function to fetch user orders and update count
  const fetchUserOrderCount = async (token) => {
    try {
      const response = await fetch(`${serverUrl}/api/order/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        dispatch(setOrderCount(data.orders.length));
      }
    } catch (error) {
      console.error("Error fetching order count:", error);
      // Don't show error to user as this is not critical
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setErrEmail("");
    setErrPassword("");

    if (!email) {
      setErrEmail("Enter your email");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrPassword("Enter your password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(serverUrl + "/api/user/login", {
        email,
        password,
      });
      const data = response?.data;
      if (data?.success) {
        localStorage.setItem("token", data?.token);
        // Fetch order count after successful login
        await fetchUserOrderCount(data?.token);
        toast.success(data?.message);
        navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("User login error", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900"
      style={{
        backgroundImage: `url('/client_login_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better contrast if needed */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[500px] px-6"
      >
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Decorative shine effect */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-10" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Login
            </h1>
            <p className="text-white/60 text-sm font-medium">
              Welcome back to your premium shopping experience
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
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
                  placeholder="Email ID"
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

            {/* Additional Options */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border border-white/20 flex items-center justify-center transition-all ${rememberMe ? 'bg-white border-white' : 'bg-transparent'}`}
                >
                  {rememberMe && <div className="w-2 h-2 bg-slate-900 rounded-[1px]" />}
                </div>
                <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors select-none">
                  Remember me
                </span>
              </label>

              <Link
                to="#"
                className="text-white/70 text-xs font-medium hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full relative h-14 bg-white text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] shadow-xl shadow-black/20 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-white/50 text-xs font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-white font-bold hover:underline underline-offset-4 decoration-white/30 transition-all"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
