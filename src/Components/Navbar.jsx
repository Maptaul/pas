import { Menu, X } from "lucide-react";
import { useContext, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/image.jpg"; // PAS logo
import { AuthContext } from "../Providers/AuthProvider";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          confirmButtonColor: "#a855f7",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: error.message,
          confirmButtonColor: "#a855f7",
        });
      });
    setIsOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white shadow-md"
      style={{ position: "-webkit-sticky", position: "sticky" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 text-purple-600 hover:text-purple-700 transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={28} />
            </button>
            <Link to="/" className="flex items-center ml-2 md:ml-0">
              <FaHome className="text-2xl mr-2 text-purple-600" />
              <img className="h-8 md:h-9" src={logo} alt="PAS Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/apply"
              className="btn btn-ghost text-gray-800 hover:bg-purple-100 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base font-poppins"
            >
              Apply Passport
            </Link>
            <Link
              to="/contact"
              className="btn btn-ghost text-gray-800 hover:bg-purple-100 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base font-poppins"
            >
              Contact Us
            </Link>
            {!user ? (
              <Link
                to="/login"
                className="btn btn-ghost text-gray-800 hover:bg-purple-100 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base font-poppins"
              >
                Login
              </Link>
            ) : (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar hover:bg-purple-100"
                >
                  <div className="w-10 rounded-full border border-gray-200">
                    <img
                      src={
                        user?.photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Profile"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg w-40 mt-2 border border-gray-200"
                >
                  <li>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-600 font-poppins"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-600 font-poppins"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 md:hidden">
          <div className="absolute left-0 top-0 h-full w-3/4 bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img className="h-10" src={logo} alt="PAS Logo" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-purple-600 hover:text-purple-700 transition-colors duration-300"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-6">
              <Link
                to="/apply"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-100 hover:text-purple-600 rounded-lg font-poppins"
              >
                Apply Passport
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-100 hover:text-purple-600 rounded-lg font-poppins"
              >
                Contact Us
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-100 hover:text-purple-600 rounded-lg font-poppins"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-100 hover:text-purple-600 rounded-lg font-poppins"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-gray-800 font-semibold hover:bg-purple-100 hover:text-purple-600 rounded-lg font-poppins"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
