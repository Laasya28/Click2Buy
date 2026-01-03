import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Users from "./pages/Users";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Docs from "./pages/Docs";
import Contacts from "./pages/Contacts";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <main className="bg-[#4338ca] min-h-screen font-sans flex overflow-hidden">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex w-full h-screen p-4 gap-4">
                {/* Sidebar - Fixed Left */}
                <div className="w-64 flex-shrink-0 hidden lg:block">
                  <Sidebar />
                </div>

                {/* Main Content - Floating White Card */}
                <div className="flex-1 bg-[#f3f4f6] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col">
                  {/* Navbar is now part of the content area header in the design, 
                      but for now we place it at top of this container */}
                  <div className="sticky top-0 z-50 bg-[#f3f4f6]">
                    <Navbar />
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {/* <ScrollToTop /> - handled by router usually, but can keep if needed */}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/add" element={<Add token={token} />} />
                      <Route path="/list" element={<List token={token} />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route
                        path="/orders"
                        element={<Orders token={token} />}
                      />
                      <Route path="/users" element={<Users token={token} />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/invoice" element={<Invoices />} />
                      <Route path="/api-docs" element={<Docs />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
