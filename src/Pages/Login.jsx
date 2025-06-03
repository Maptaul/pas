import { useContext, useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProvider";
// Import your logo from Navbar or assets
import passportLogo from "../assets/Gemini.png";

const Login = () => {
  const { signIn, googleSignIn, resetPassword, user, displayName, photoURL } =
    useContext(AuthContext) || {};
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const passwordToggleRef = useRef(null);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        passwordToggleRef.current &&
        !passwordToggleRef.current.contains(event.target)
      ) {
        setPasswordVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!signIn) {
      setError("Authentication context missing.");
      return;
    }
    setLoading(true);
    setError(null);
    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password)
      .then(() => {
        Swal.fire({
          title: "Login successful",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
        });
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    if (!googleSignIn) {
      setError("Authentication context missing.");
      return;
    }
    setLoading(true);
    setError(null);
    googleSignIn()
      .then(() => {
        Swal.fire({
          title: "Login successful",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
        });
        setLoading(false);
      });
  };

  const handleForgotPassword = () => {
    if (!resetPassword) {
      Swal.fire({
        icon: "error",
        title: "Authentication context missing.",
        text: "Password reset is unavailable.",
      });
      return;
    }
    Swal.fire({
      title: "Forgot Password?",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "Enter your email",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      cancelButtonText: "Cancel",
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage("Email is required.");
          return;
        }
        if (!validateEmail(email)) {
          Swal.showValidationMessage("Invalid email address.");
          return;
        }
        return resetPassword(email)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Reset email sent",
              text: "Check your email for the reset link.",
              timer: 3000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Reset failed",
              text: error.message,
            });
          });
      },
    });
  };

  return (
    <section
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-2xl bg-white/95 backdrop-blur">
          {/* Left Panel */}
          <div className="bg-[#640D5F] md:w-1/2 flex flex-col justify-center items-center p-8 text-center text-white">
            <img
              src={passportLogo}
              alt="Passport Automation System Logo"
              className="w-20 mb-4 rounded-full drop-shadow-lg"
            />
            <h2 className="text-2xl font-bold mb-2">
              Passport Automation System
            </h2>
            <p className="text-base opacity-90">Government of Bangladesh</p>
          </div>
          {/* Right Panel */}
          <div className="bg-gray-50 md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 text-center text-[#640D5F]">
              Welcome to the Passport Automation System
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-label="Login Form"
              autoComplete="off"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full border-[#640D5F] focus:border-[#640D5F] focus:ring-[#640D5F] rounded-md bg-white"
                  required
                  aria-required="true"
                  autoComplete="username"
                />
              </div>
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input input-bordered w-full border-[#640D5F] focus:border-[#640D5F] focus:ring-[#640D5F] rounded-md bg-white pr-10"
                    required
                    aria-required="true"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    ref={passwordToggleRef}
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-[#640D5F] focus:outline-none"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    aria-label="Remember me"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#640D5F] hover:underline font-medium"
                  aria-label="Forgot password"
                >
                  Forgot password?
                </button>
              </div>
              {/* Error */}
              {error && (
                <div aria-live="polite">
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}
              {/* Login Button */}
              <button
                className="w-full py-2 bg-[#640D5F] text-white rounded-md font-semibold hover:bg-[#4a0a47] transition disabled:bg-gray-400"
                disabled={loading}
                aria-label="Login"
                type="submit"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin inline-block"></span>
                ) : (
                  "Login"
                )}
              </button>
              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-3 text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>
              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 bg-white border border-[#640D5F] text-[#640D5F] rounded-md font-semibold hover:bg-[#640D5F] hover:text-white transition flex items-center justify-center gap-2 disabled:bg-gray-200"
                disabled={loading}
                aria-label="Login with Google"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-t-transparent border-[#640D5F] rounded-full animate-spin inline-block"></span>
                ) : (
                  <>
                    <FaGoogle /> Login with Google
                  </>
                )}
              </button>
            </form>
            <p className="text-center text-sm mt-5">
              Don't have an account?{" "}
              <Link
                to="/signUp"
                className="text-[#640D5F] hover:underline font-semibold"
              >
                Register
              </Link>
            </p>
            <div className="text-center text-xs mt-6 opacity-70">
              {user && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img
                    src={photoURL || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="font-medium text-gray-800">
                    {displayName}
                  </span>
                </div>
              )}
              Innovated by{" "}
              <a
                href="https://www.jionex.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block align-middle transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="Visit Jionex website"
              >
                <img
                  src="https://i.ibb.co/XMXd54n/jionex-logo.png"
                  alt="Jionex Logo"
                  className="inline h-6 ml-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
