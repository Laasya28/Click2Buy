import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/ui/title";
import { serverUrl } from "../../config";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBook, FaTimes } from "react-icons/fa";

const Docs = () => {
    const { token } = useSelector((state) => state.auth);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        content: ""
    });

    const categories = ["General", "API", "Guide", "Policy", "Other"];

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/doc/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setDocs(response.data.docs);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load docs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingDoc) {
                response = await axios.post(`${serverUrl}/api/doc/update`,
                    { ...formData, id: editingDoc._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await axios.post(`${serverUrl}/api/doc/add`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            if (response.data.success) {
                toast.success(editingDoc ? "Doc updated" : "Doc created");
                setIsModalOpen(false);
                setEditingDoc(null);
                setFormData({ title: "", category: "", content: "" });
                fetchDocs();
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document?")) return;
        try {
            const response = await axios.post(`${serverUrl}/api/doc/delete`,
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Doc deleted");
                fetchDocs();
            }
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    }

    const openEdit = (doc) => {
        setEditingDoc(doc);
        setFormData({
            title: doc.title,
            category: doc.category,
            content: doc.content
        });
        setIsModalOpen(true);
    }

    const filteredDocs = docs.filter(
        (d) =>
            d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading documentation...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <Title>Documentation</Title>
                    <p className="text-gray-500 mt-1">Manage system documentation and guides</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingDoc(null);
                            setFormData({ title: "", category: "", content: "" });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
                    >
                        <FaPlus /> Add Doc
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                    <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider">
                                {doc.category}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(doc)} className="text-gray-400 hover:text-blue-500 p-1">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(doc._id)} className="text-gray-400 hover:text-red-500 p-1">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{doc.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                            {doc.content}
                        </p>
                        <div className="text-xs text-gray-400 pt-4 border-t border-gray-50 flex items-center gap-2">
                            <FaBook />
                            Last updated: {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {filteredDocs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">No documents found</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-6">{editingDoc ? 'Edit Document' : 'New Document'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                                >
                                    {editingDoc ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Docs;
