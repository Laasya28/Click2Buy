import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link
import PropTypes from "prop-types";
import axios from "axios";
import { serverUrl } from "../../config";
import { FaFileInvoice, FaWallet } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { token } = useSelector((state) => state.auth);
  const [chartPeriod, setChartPeriod] = useState("monthly"); // "weekly" or "monthly"
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    loading: true,
    error: null,
  });

  const [analyticsData, setAnalyticsData] = useState({
    labels: [],
    orders: [],
    revenue: []
  });

  const fetchStatistics = useCallback(async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.get(`${serverUrl}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { stats: serverStats } = response.data;
        setStats({
          totalProducts: serverStats.totalProducts || 0,
          totalOrders: serverStats.totalOrders || 0,
          totalUsers: serverStats.totalUsers || 0,
          totalRevenue: serverStats.totalRevenue || 0,
          recentOrders: serverStats.recentOrders || [],
          topProducts: serverStats.topProducts || [],
          loading: false,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load dashboard data",
      }));
    }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/dashboard/analytics?period=${chartPeriod}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { salesData } = response.data.analytics;

        const labels = [];
        const orders = [];
        const revenue = [];

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        if (chartPeriod === "weekly") {
          // Normalize Weekly Data (Last 7 days)
          const dataMap = {};
          salesData.forEach(item => {
            if (item._id.day) {
              const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
              dataMap[key] = item;
            }
          });

          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);

            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-indexed for backend match
            const day = d.getDate();
            const key = `${year}-${month}-${day}`;

            labels.push(dayNames[d.getDay()]); // "Mon", "Tue"...
            if (dataMap[key]) {
              orders.push(dataMap[key].orders);
              revenue.push(dataMap[key].revenue);
            } else {
              orders.push(0);
              revenue.push(0);
            }
          }

        } else {
          // Normalize Monthly Data (Last 6 months as per backend default, or 12 if we wanted)
          // Backend defaults to 6 months. Let's assume 6 months for now based on backend logic.
          const dataMap = {};
          salesData.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            dataMap[key] = item;
          });

          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            d.setDate(1); // Avoid edge cases with shorter months

            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const key = `${year}-${month}`;

            labels.push(monthNames[d.getMonth()]); // "Jan", "Feb"...
            if (dataMap[key]) {
              orders.push(dataMap[key].orders);
              revenue.push(dataMap[key].revenue);
            } else {
              orders.push(0);
              revenue.push(0);
            }
          }
        }

        setAnalyticsData({ labels, orders, revenue });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, [token, chartPeriod]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);


  // INR Currency Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = {
    labels: analyticsData.labels.length > 0 ? analyticsData.labels : ['No Data'],
    datasets: [
      {
        label: 'Orders',
        data: analyticsData.orders,
        backgroundColor: 'rgba(139, 92, 246, 0.7)', // Purple-500
        borderRadius: 4,
      },
      {
        label: 'Revenue',
        data: analyticsData.revenue,
        backgroundColor: 'rgba(236, 72, 153, 0.7)', // Pink-500
        yAxisID: 'y1',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Sales Statistics',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          display: false
        }
      },
      y1: {
        type: 'linear',
        display: false, // Hide secondary axis for cleaner look
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };


  if (stats.loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Orders Card - Light Blue/Cyan Gradient Effect */}
        <div className="relative overflow-hidden rounded-3xl p-6 shadow-sm bg-[#e0f2fe]">
          {/* Soft decorative blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#bae6fd] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="p-3 bg-white rounded-xl shadow-sm text-cyan-500">
              <FaFileInvoice size={24} />
            </div>
            <span className="bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-full">+20</span>
          </div>

          <div className="relative z-10 mt-4">
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h3>
            <p className="text-cyan-800 font-medium">Orders</p>
          </div>
        </div>

        {/* Revenue Card - Pink/Rose Gradient Effect */}
        <div className="relative overflow-hidden rounded-3xl p-6 shadow-sm bg-[#fce7f3]">
          {/* Soft decorative blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fbcfe8] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="p-3 bg-white rounded-xl shadow-sm text-pink-500">
              <FaWallet size={24} />
            </div>
            <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">+$840.00</span>
          </div>

          <div className="relative z-10 mt-4">
            <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-pink-800 font-medium">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Chart & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Statistics (Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Sales Statistics</h3>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 text-gray-500 outline-none"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="h-64 w-full">
            {/* ChartJS Bar Chart */}
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Selling Products</h3>
            <Link to="/list" className="text-sm text-indigo-500 font-medium hover:underline">See all</Link>
          </div>
          <div className="space-y-4">
            {stats.topProducts.slice(0, 4).map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                  {/* Placeholder for product img if not available */}
                  {product.image ? <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover rounded-xl" /> : (index + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No top products yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Unique Visitors (Extra row from image reference) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Unique Visitors</h3>
          <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 text-gray-500 outline-none">
            <option>Weekly</option>
          </select>
        </div>
        <div className="h-40 w-full flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400">
          {/* Placeholder for Visitors Chart */}
          <p>Visitors Chart Graph Placeholder</p>
        </div>
      </div>

    </div>
  );
};

export default Home;
