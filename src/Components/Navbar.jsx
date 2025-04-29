import { Menu, X } from "lucide-react";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/image.jpg"; // Assuming the new logo is saved as pas-logo.png

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
              <img className="h-10 md:h-12" src={logo} alt="PAS Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-6">
            <Link
              to="/apply-passport"
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
            <Link
              to="/login"
              className="btn btn-primary bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-4 py-2 font-semibold text-base font-poppins transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 md:hidden">
          <div className="absolute left-0 top-0 h-full w-3/4 bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img className="h-12" src={logo} alt="PAS Logo" />
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
                to="/apply-passport"
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
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 rounded-lg font-poppins transition-colors duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
