import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#f3f4f6]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || "Damian"}
        </h2>
        <p className="text-sm text-gray-500">Here is what’s happening with your store today.</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="pl-10 pr-4 py-2 bg-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm text-sm"
          />
        </div>

        {/* Icons */}
        <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profile User */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-300">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white" />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
