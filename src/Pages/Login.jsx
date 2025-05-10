import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginLottie from "../assets/lottie/login.json";
import { AuthContext } from "../Providers/AuthProvider";

const Login = () => {
  const { signIn, googleSignIn, resetPassword } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";
  console.log("state in the location login page", location.state);
  console.log("Location object:", location);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  const handleForgotPassword = () => {
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
          Swal.showValidationMessage("Email is required");
          return;
        }
        return resetPassword(email)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Reset Email Sent",
              text: "Check your email to reset your password",
              timer: 3000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Reset Failed",
              text: error.message,
            });
          });
      },
    });
  };

  return (
    <div className="min-h-screen md:flex justify-center items-center">
      <div className="text-center lg:text-left w-96">
        <Lottie animationData={loginLottie}></Lottie>
      </div>
      <div className="card bg-base-200 w-full max-w-lg p-10 text-black shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          Complainant Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
              onChange={() => setError(null)}
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
                onChange={() => setError(null)}
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* Login Button */}
          <div className="form-control mt-4">
            <button className="btn btn-primary w-full">Login</button>
          </div>
        </form>

        {/* Google Login Button */}
        <div className="divider my-4">OR</div>
        <div className="text-center gap-2">
          <button className="btn btn-outline mr-4" onClick={handleGoogleLogin}>
            <FaGoogle className="mr-2" /> Login with Google
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center font-medium mt-5">
          Don't have an account?{" "}
          <Link className="text-blue-500 hover:underline" to="/signUp">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
