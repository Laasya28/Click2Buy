import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/ui/title";
import { serverUrl } from "../../config";
import { FaFileInvoice, FaPrint, FaSearch, FaEye } from "react-icons/fa";

const Invoices = () => {
    const { token } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Reuse order list API
                const response = await fetch(`${serverUrl}/api/order/list`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success) {
                    // Only show confirmed/shipped/delivered orders for invoices usually
                    setOrders(data.orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending'));
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load invoice data");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const filteredOrders = orders.filter(
        (order) =>
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 no-print">
                <div>
                    <Title>Invoices</Title>
                    <p className="text-gray-500 mt-1">View and print customer invoices</p>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search invoice #..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Invoice List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Invoice #</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-blue-600">INV-{order._id.slice(-6).toUpperCase()}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{order.userId?.name || "Guest"}</div>
                                    <div className="text-sm text-gray-500">{order.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(order.amount)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedInvoice(order)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                                    >
                                        <FaEye /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No invoices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invoice Modal / Print View */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none print:w-full print:max-w-none print:rounded-none">

                        {/* Modal Header (Hidden in Print) */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 no-print">
                            <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <FaPrint /> Print
                                </button>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div className="p-8 sm:p-12" id="invoice-content">
                            {/* Header */}
                            <div className="flex justify-between mb-12">
                                <div>
                                    <h1 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h1>
                                    <p className="text-gray-500 font-medium">#INV-{selectedInvoice._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-bold text-gray-800">Click2Buy Inc.</h2>
                                    <p className="text-gray-500 text-sm mt-1">123 Commerce St.<br />Business City, 12345<br />support@click2buy.com</p>
                                </div>
                            </div>

                            {/* Bill To & Info */}
                            <div className="flex justify-between mb-12">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                                    <p className="font-bold text-gray-800">{selectedInvoice.address?.firstName} {selectedInvoice.address?.lastName}</p>
                                    <p className="text-gray-600 text-sm whitespace-pre-line">
                                        {selectedInvoice.address?.street}, {selectedInvoice.address?.city}<br />
                                        {selectedInvoice.address?.state}, {selectedInvoice.address?.zipcode}<br />
                                        {selectedInvoice.address?.country}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">{selectedInvoice.address?.phone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Date</h3>
                                        <p className="font-medium text-gray-800">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h3>
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
                                            {selectedInvoice.paymentStatus === 'paid' ? 'PAID' : selectedInvoice.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full mb-8">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-3 font-bold text-gray-600">Item Description</th>
                                        <th className="text-right py-3 font-bold text-gray-600">Info</th>
                                        <th className="text-right py-3 font-bold text-gray-600">Price</th>
                                        <th className="text-right py-3 font-bold text-gray-600">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {selectedInvoice.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-4">
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}</p>
                                            </td>
                                            <td className="py-4 text-right text-gray-600">x{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(selectedInvoice.amount)}</span>
                                    </div>
                                    {/* Add tax/shipping logic here if available in data */}
                                    <div className="flex justify-between text-blue-600 border-t border-gray-100 pt-3">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold">{formatCurrency(selectedInvoice.amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
                                <p>Thank you for your business!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Invoices;
