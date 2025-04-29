import Lottie from "lottie-react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import loginLottie from "../assets/lottie/login.json";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login submitted!");
  };

  return (
    <div className="min-h-screen md:flex justify-center items-center bg-gray-50">
      {/* Lottie Animation */}
      <div className="text-center lg:text-left w-96">
        <Lottie animationData={loginLottie}></Lottie>
      </div>

      {/* Login Card */}
      <div className="card bg-base-100 w-full max-w-lg p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-600 font-poppins">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-poppins">Email</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-poppins">Password</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
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
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:underline font-poppins"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <div className="form-control mt-4">
            <button className="btn btn-primary bg-purple-600 text-white hover:bg-purple-700 w-full font-poppins transition-colors duration-300">
              Login
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center font-medium mt-5 font-poppins">
          Don't have an account?{" "}
          <Link className="text-purple-600 hover:underline" to="/signUp">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
