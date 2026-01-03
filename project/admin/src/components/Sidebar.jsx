import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../redux/authSlice";
import { IoMdAdd } from "react-icons/io";
import {
  FaList,
  FaUsers,
  FaBox,
  FaChevronDown,
  FaChevronRight,
  FaFileInvoice,
  FaSignOutAlt,
  FaTags,
  FaBook,
  FaEnvelope,
} from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdInventory } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { HiOutlineClipboardList } from "react-icons/hi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [expandedCategories, setExpandedCategories] = useState({
    Products: false,
  });

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <MdDashboard />,
      path: "/",
    },
    {
      title: "Orders",
      icon: <HiOutlineClipboardList />,
      path: "/orders",
    },
    {
      title: "Products",
      icon: <BiPackage />,
      path: "#",
      isCategory: true,
      children: [
        { title: "Add Product", icon: <IoMdAdd />, path: "/add" },
        { title: "List", icon: <FaList />, path: "/list" },
        { title: "Inventory", icon: <MdInventory />, path: "/inventory" },
        { title: "Categories", icon: <FaTags />, path: "/categories" },
      ],
    },
    {
      title: "Analytics",
      icon: <MdAnalytics />,
      path: "/analytics",
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
    },
    {
      title: "Marketing", // Placeholder for "Marketing" in image if needed, using Contacts for now
      icon: <FaEnvelope />,
      path: "/contacts",
      label: "Contacts"
    },
    {
      title: "Docs",
      icon: <FaBook />,
      path: "/api-docs",
    },
    {
      title: "Invoice",
      icon: <FaFileInvoice />,
      path: "/invoice",
    },
  ];

  const renderNavItem = (item, isChild = false) => {
    if (item.isCategory) {
      const isExpanded = expandedCategories[item.title];
      return (
        <div key={item.title} className="mb-2">
          <button
            onClick={() => toggleCategory(item.title)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-white/70 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </div>
            <span>{isExpanded ? <FaChevronDown /> : <FaChevronRight />}</span>
          </button>
          <div
            className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            {item.children?.map((child) => renderNavItem(child, true))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${isActive
            ? "bg-white/10 text-white font-semibold backdrop-blur-sm"
            : "text-white/70 hover:text-white hover:bg-white/5"
          } ${isChild ? "text-sm py-2" : ""}`
        }
      >
        <span className="text-xl">{item.icon}</span>
        <span className="font-medium">{item.label || item.title}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header / Logo */}
      <div className="p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
            <span className="font-bold text-lg">C</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Click2Buy</h1>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all w-full"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="font-medium">Log out</span>
        </button>
        <div className="mt-4 px-4 text-xs text-white/30">
          © 2025 Click2Buy Admin
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
