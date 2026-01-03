import { useState, useEffect } from "react";
import { FaBoxes, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { MdOutlineInventory, MdLowPriority } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStockThreshold = 10;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  const lowStockCount = lowStockItems.length;
  const inStock = products.filter(p => p.stock > lowStockThreshold).length; // Or just > 0 minus low stock? Usually "In Stock" means available, but for stats breakdown, maybe "Healthy Stock" vs "Low Stock". Let's stick to "In Stock" meaning > 0.
  const availableProducts = products.filter(p => p.stock > 0).length;


  const inventoryStats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FaBoxes />,
      color: "blue",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: <FaExclamationTriangle />,
      color: "yellow",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: <MdLowPriority />,
      color: "red",
    },
    {
      title: "Available Stock",
      value: availableProducts,
      icon: <FaCheckCircle />,
      color: "green",
    },
  ];

  const handleQuickAction = (action) => {
    toast.success(`${action} feature coming soon!`);
  };

  if (loading) {
    return <div className="p-6">Loading inventory...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage your product inventory
        </p>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {inventoryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
              >
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Low Stock Alert (Below {lowStockThreshold} units)
            </h3>
          </div>
        </div>
        <div className="p-6">
          {lowStockItems.length > 0 ? (
            <div className="space-y-4">
              {lowStockItems.slice(0, 5).map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Category: {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-yellow-600">
                      {item.stock}
                    </span>
                    <p className="text-sm text-gray-600">units left</p>
                  </div>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <p className="text-center text-sm text-gray-500 mt-2">...and {lowStockItems.length - 5} more items</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No low stock items found. Great job!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleQuickAction("Update Inventory")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <MdOutlineInventory className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">
                Update Inventory
              </p>
            </button>
            <button
              onClick={() => handleQuickAction("Bulk Import")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <FaBoxes className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">Bulk Import</p>
            </button>
            <button
              onClick={() => handleQuickAction("Stock Audit")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <FaCheckCircle className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">Stock Audit</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
