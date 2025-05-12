import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { motion } from "framer-motion";
import Loading from "../../Components/Loading";

// Icons for ProfileItem (using Heroicons as an example)
import { UserIcon, EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, role, loading } = useContext(AuthContext);

  const renderNoUser = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
      <svg
        className="w-20 h-20 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-2xl font-semibold text-red-600">
        No user is currently logged in
      </p>
      <p className="text-gray-500">
        Please log in to view your profile details.
      </p>
    </div>
  );

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-6"
    >
      {/* Avatar Section */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt={`${user.displayName || "User"}'s profile`}
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-2xl opacity-60"></div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.displayName || "Not provided"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{user.email || "Not provided"}</p>
      </div>

      {/* Profile Details */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <ProfileItem
          label="Name"
          value={user.displayName || "Not provided"}
          icon={<UserIcon className="w-6 h-6 text-blue-600" />}
        />
        <ProfileItem
          label="Email"
          value={user.email || "Not provided"}
          icon={<EnvelopeIcon className="w-6 h-6 text-blue-600" />}
        />
        <ProfileItem
          label="Role"
          value={role || "User"}
          icon={<ShieldCheckIcon className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </motion.div>
  );

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Profile
        </motion.h1>
        {loading ? <Loading /> : !user ? renderNoUser() : renderProfile()}
      </div>
    </section>
  );
};

const ProfileItem = ({ label, value, icon }) => (
  <motion.div
    className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50"
    whileHover={{ scale: 1.02 }}
  >
    {icon}
    <div className="flex-1">
      <span className="block text-sm font-medium text-gray-500">{label}</span>
      <span className="block text-lg text-gray-800">{value}</span>
    </div>
  </motion.div>
);

export default Profile;