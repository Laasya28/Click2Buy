import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import { setOrderCount } from "../redux/orebiSlice";
import toast from "react-hot-toast";
import { FaShoppingBag, FaTruck, FaBox } from "react-icons/fa";

const OrderCard = ({ order, index, formatDate, getStatusColor, setCancelModal }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    {/* Order Header */}
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-sm text-gray-600">Order:</span>
          <span className="ml-2 font-semibold text-gray-900">
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-600">
            Order Placed:
          </span>
          <span className="ml-2 text-sm text-gray-900">
            {formatDate(order.date || order.createdAt)}
          </span>
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div className="p-6">
      <div className="space-y-4">
        {order.items?.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
          >
            {/* Product Image */}
            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  item.productId?.images?.[0] ||
                  item.image ||
                  "/placeholder.png"
                }
                alt={item.productId?.name || item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {item.productId?.name || item.name}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600 mb-2">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
              <p className="text-sm font-semibold text-gray-900">
                <PriceFormat
                  amount={
                    (item.productId?.price || item.price || 0) *
                    (item.quantity || 1)
                  }
                />
              </p>
            </div>

            {/* Status and Date */}
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status || "In Transit"}
              </span>
              <p className="text-sm text-gray-600">
                {formatDate(order.date || order.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={() =>
            setCancelModal({ isOpen: true, orderId: order._id })
          }
          disabled={order.status?.toLowerCase() === "cancelled" || order.status?.toLowerCase() === "delivered"}
          className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {order.status?.toLowerCase() === "cancelled" ? "ORDER CANCELLED" : "CANCEL ORDER"}
        </button>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">
            <PriceFormat amount={order.amount || 0} />
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
  });
  const [cancelling, setCancelling] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/order/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        dispatch(setOrderCount(data.orders.length));
      } else {
        setError(data.message || "Failed to fetch orders");
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
      return;
    }
    fetchUserOrders();
  }, [userInfo, navigate, fetchUserOrders]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
      case "in transit":
        return "bg-orange-100 text-orange-600";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleCancelOrder = async () => {
    if (!cancelModal.orderId) return;

    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/order/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: cancelModal.orderId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Order cancelled and removed successfully");
        fetchUserOrders(); // Refresh orders
        setCancelModal({ isOpen: false, orderId: null });
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserOrders}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <FaShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">
            Track and manage all your orders in one place
          </p>
        </Container>
      </div>

      <Container className="py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <FaBox className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active/In-Transit Orders */}
            {orders.filter(order => order.status?.toLowerCase() !== "delivered").length > 0 && (
              <div className="space-y-6">
                {orders
                  .filter(order => order.status?.toLowerCase() !== "delivered")
                  .map((order, index) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      index={index}
                      formatDate={formatDate}
                      getStatusColor={getStatusColor}
                      setCancelModal={setCancelModal}
                    />
                  ))}
              </div>
            )}

            {/* Delivered Orders Section */}
            {orders.filter(order => order.status?.toLowerCase() === "delivered").length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <FaTruck className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Delivered</h2>
                </div>
                <div className="space-y-6">
                  {orders
                    .filter(order => order.status?.toLowerCase() === "delivered")
                    .map((order, index) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        index={index}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                        setCancelModal={setCancelModal}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {cancelModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Cancel Order?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setCancelModal({ isOpen: false, orderId: null })
                  }
                  disabled={cancelling}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Cancelling...
                    </div>
                  ) : (
                    "Yes, Cancel Order"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Order;
