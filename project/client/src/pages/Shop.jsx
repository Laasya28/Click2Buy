import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "../components/Container";
import ProductsSideNav from "../components/products/ProductsSideNav";
import PaginationProductList from "../components/products/PaginationProductList";
import { config } from "../../config";
import { getData } from "../helpers";
import {
  FaTshirt,
  FaMobileAlt,
  FaCouch,
  FaSprayCan,
  FaRunning,
  FaGamepad,
  FaShoppingBasket,
  FaBook,
  FaEllipsisH,
  FaFilter,
} from "react-icons/fa";

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const endpoint = `${config?.baseUrl}/api/products`;

  // Helper to get icons based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("fashion") || name.includes("clothing") || name.includes("shirt")) return <FaTshirt />;
    if (name.includes("electr") || name.includes("mobile") || name.includes("phone")) return <FaMobileAlt />;
    if (name.includes("furnit") || name.includes("home") || name.includes("sofa")) return <FaCouch />;
    if (name.includes("beauty") || name.includes("cosmetic")) return <FaSprayCan />;
    if (name.includes("sport") || name.includes("fitness")) return <FaRunning />;
    if (name.includes("toy") || name.includes("game")) return <FaGamepad />;
    if (name.includes("grocer") || name.includes("food")) return <FaShoppingBasket />;
    if (name.includes("book") || name.includes("education")) return <FaBook />;
    return <FaEllipsisH />;
  };

  // Handle URL parameters for category filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        category: categoryParam,
      }));
    }
  }, [location.search]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await getData(`${config?.baseUrl}/api/category`);
        if (data?.success) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await getData(endpoint);
        setProducts(data?.products || []);
        setFilteredProducts(data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [endpoint]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((product) =>
        product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((product) =>
        product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Keep original order (newest first from API)
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Auto-close mobile filters when a filter is applied (optional UX enhancement)
    if (window.innerWidth < 1024) {
      setTimeout(() => setMobileFiltersOpen(false), 500);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      priceRange: "",
      search: "",
    });
    // Auto-close mobile filters when clearing (optional UX enhancement)
    if (window.innerWidth < 1024) {
      setTimeout(() => setMobileFiltersOpen(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8 space-y-8">

        {/* Top Section: Heading & Category Navigation */}
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Categories</h1>

          <button
            onClick={() => handleFilterChange({ category: "" })}
            className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${!filters.category
              ? "bg-blue-600 text-white hover:bg-blue-700 ring-4 ring-blue-100"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-300"
              }`}
          >
            All Products
          </button>

          {/* Horizontal Category Cards */}
          <div className="w-full flex justify-center">
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 w-full max-w-5xl justify-start lg:justify-center scrollbar-hide snap-x">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleFilterChange({ category: cat.name })}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 p-3 rounded-2xl bg-white border shadow-sm transition-all snap-center group hover:shadow-md hover:-translate-y-1 ${filters.category === cat.name
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-100 hover:border-blue-200"
                    }`}
                >
                  <div className={`text-3xl mb-2 transition-colors ${filters.category === cat.name ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                    }`}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <span className={`text-xs font-medium text-center line-clamp-2 ${filters.category === cat.name ? "text-blue-700" : "text-gray-600 group-hover:text-gray-900"
                    }`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Content */}
          <main className="w-full">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Left: Title */}
              <h2 className="text-xl font-bold text-gray-800">
                {filters.category ? `${filters.category} Items` : "All Items"}
              </h2>

              {/* Right: Actions */}
              <div className="flex items-center gap-4 text-sm">
                {/* Results Count */}
                <span className="text-gray-500">
                  Showing {filteredProducts.length} results
                </span>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="Grid View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    aria-label="List View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="min-h-[500px]">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <PaginationProductList
                  products={filteredProducts}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  viewMode={viewMode}
                />
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
