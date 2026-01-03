import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/ui/title";
import { serverUrl } from "../../config";
import { FaTrash, FaEnvelope, FaUser, FaClock, FaSearch } from "react-icons/fa";

const Contacts = () => {
    const { token } = useSelector((state) => state.auth);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/contact/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setContacts(response.data.contacts);
            } else {
                toast.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const response = await axios.post(
                `${serverUrl}/api/contact/remove`,
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Message deleted");
                fetchContacts();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting message");
        }
    };

    const filteredContacts = contacts.filter(
        (c) =>
            c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <Title>Messages</Title>
                    <p className="text-gray-500 mt-1">Manage inquiries from your contact form</p>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                        <div
                            key={contact._id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{contact.clientName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <FaEnvelope className="text-xs" />
                                            <span>{contact.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                        <FaClock className="text-gray-300" />
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(contact._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                        title="Delete Message"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="pl-[52px]">
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">
                                    {contact.messages}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <FaEnvelope className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-500">No messages found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;
