import { Menu, X } from "lucide-react";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white shadow-md"
      style={{ position: "-webkit-sticky", position: "sticky" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 text-gray-600 hover:text-purple-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={28} />
            </button>
            <Link to="/" className="flex items-center ml-2 md:ml-0">
              <FaHome className="text-2xl mr-2 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800">
                Passport Automation
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/apply-passport"
              className="btn btn-ghost text-gray-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base"
            >
              Apply for Passport
            </Link>
            <Link
              to="/status"
              className="btn btn-ghost text-gray-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base"
            >
              Status
            </Link>
            <Link
              to="/contact"
              className="btn btn-ghost text-gray-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg px-4 py-2 font-semibold text-base"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="btn btn-ghost btn-circle bg-purple-600 hover:bg-purple-700 text-white md:hidden"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 md:hidden">
          <div className="absolute left-0 top-0 h-full w-3/4 bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <span className="text-xl font-semibold text-gray-800">
                  Passport Automation
                </span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-purple-600"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-6">
              <Link
                to="/apply-passport"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              >
                Apply for Passport
              </Link>
              <Link
                to="/status"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              >
                Status
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-800 font-semibold hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
