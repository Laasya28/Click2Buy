import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../config";
import {
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { token } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setDashboardData({
            totalRevenue: response.data.stats.totalRevenue,
            totalOrders: response.data.stats.totalOrders,
            totalUsers: response.data.stats.totalUsers,
            loading: false
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.totalRevenue),
      change: "+12.5%", // Calculated change would require historical data
      trend: "up",
      icon: <FaDollarSign />,
      color: "green",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: <FaShoppingCart />,
      color: "blue",
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: <FaUsers />,
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: "3.24%", // Placeholder as we don't have visitor tracking yet
      change: "-2.1%",
      trend: "down",
      icon: <FaChartLine />,
      color: "orange",
    },
  ];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const orderData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your business performance and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
              >
                {stat.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {stat.trend === "up" ? <MdTrendingUp /> : <MdTrendingDown />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Chart
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Line data={revenueData} options={options} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Trends
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Bar data={orderData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
