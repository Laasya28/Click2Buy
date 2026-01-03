import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";
import { removeUser, resetOrderCount, addUser } from "../redux/orebiSlice";
import Container from "../components/Container";
import { FaUser, FaSignOutAlt, FaSave, FaEdit, FaTimes, FaEnvelope, FaPlus, FaTrash, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
      return;
    }
    fetchUserProfile();
    fetchUserAddresses();
  }, [userInfo, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${serverUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const user = response.data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${serverUrl}/api/user/profile`,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Update Redux store with new name
        dispatch(addUser({ ...userInfo, name: formData.name }));
        // Refresh profile data
        await fetchUserProfile();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    dispatch(resetOrderCount());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchUserProfile(); // Reset to original data
  };

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${serverUrl}/api/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${serverUrl}/api/user/addresses`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Address added successfully!");
        setIsAddressModalOpen(false);
        setNewAddress({ label: "Home", street: "", city: "", state: "", zipCode: "", country: "", phone: "" });
        fetchUserAddresses();
      }
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${serverUrl}/api/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address deleted");
      fetchUserAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${serverUrl}/api/user/addresses/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserAddresses();
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfeff] relative overflow-hidden py-12">
      {/* Soft Background Animated Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-indigo-50/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-pink-50/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000 pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start">

          {/* Sidebar - My Account Section */}
          <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">My Account</h2>
            </div>
            <div className="p-8 text-center border-b border-gray-100">
              <div className="relative inline-block group mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-300" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{formData.name || userInfo?.name || "User"}</h3>
              <p className="text-sm text-gray-500 font-medium truncate">{userInfo?.email || formData.email}</p>
            </div>

            <nav className="p-4 space-y-1">
              <SidebarItem icon={FaUser} label="My Profile" active={true} />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold group"
              >
                <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8 w-full">

            {/* My Profile Header & Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg font-bold transition-all text-sm shadow-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="p-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Personal Information</h4>

                {!isEditing ? (
                  <div className="divide-y divide-gray-50 border-t border-gray-50">
                    <DetailRow label="Full Name:" value={formData.name} />
                    <DetailRow label="Email Address:" value={userInfo?.email || formData.email} />
                    <DetailRow label="Phone Number:" value={formData.phone} />
                    <DetailRow label="Address:" value={formData.address} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                      <ProfileInput label="Email Address" name="email" value={userInfo?.email || formData.email} disabled />
                      <ProfileInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234-567-890" />
                      <ProfileInput label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full address" />
                    </div>

                    <div className="flex items-center gap-4 justify-end pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-2.5 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Address Book Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold transition-all text-sm"
                >
                  <FaPlus className="text-xs" /> Add New
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div key={addr._id} className={`group relative border p-6 rounded-xl transition-all ${addr.isDefault ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100 hover:border-blue-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${addr.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {addr.label}
                            </span>
                            {addr.isDefault && <FaCheckCircle className="text-blue-600 text-sm" />}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefault(addr._id)} className="text-xs font-bold text-blue-600 hover:underline">Set Default</button>
                            )}
                            <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <h5 className="font-bold text-gray-900 mb-1">{addr.street}</h5>
                        <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-gray-500 text-sm mt-1">{addr.country}</p>
                        {addr.phone && <p className="text-gray-400 text-xs mt-3 flex items-center gap-1"><FaUser size={10} /> {addr.phone}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                      <FaMapMarkerAlt className="mx-auto text-4xl text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No addresses saved yet.</p>
                      <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                      >
                        Add your first address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Add Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">Add New Address</h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAddAddress} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Address Label</label>
                    <div className="flex gap-3">
                      {["Home", "Work", "Office", "Other"].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setNewAddress({ ...newAddress, label })}
                          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${newAddress.label === label ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <ProfileInput label="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} placeholder="123 Shopping St." />
                  </div>
                  <ProfileInput label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="New York" />
                  <ProfileInput label="State / Province" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="NY" />
                  <ProfileInput label="Zip Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} placeholder="10001" />
                  <ProfileInput label="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} placeholder="United States" />
                  <div className="md:col-span-2">
                    <ProfileInput label="Phone Number for Delivery" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="+1 234 567 890" />
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Save Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components for cleaner structure
const SidebarItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold cursor-pointer ${active ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-l-none' : 'text-gray-500 hover:bg-gray-50'}`}>
    <Icon className="text-lg" />
    <span>{label}</span>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 py-5 items-center">
    <span className="text-sm font-bold text-gray-600">{label}</span>
    <span className="sm:col-span-2 text-sm font-medium text-gray-900">{value || <span className="text-gray-300 italic">Not provided</span>}</span>
  </div>
);

const ProfileInput = ({ label, name, value, onChange, disabled, placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-5 py-3 rounded-xl border ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 font-medium'}`}
    />
  </div>
);

export default Profile;
