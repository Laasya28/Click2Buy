
import { useState, useEffect } from "react";
import { getData } from "../../helpers";
import { config } from "../../../config";

const ProductsSideNav = ({ onFilterChange, filters, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Categories fetching moved to Shop.jsx

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ search: value });
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    onFilterChange({ priceRange: `${min}-${max}` });
  };

  return (
    <div className="space-y-8">
      {/* Main Filters Header */}
      <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">Filters</h2>

      {/* Search */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Search</h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
          />
          <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories removed - moved to top bar in Shop.jsx */}

      {/* Price Range */}
      <div className="space-y-5">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Price</h3>

        {/* Min/Max Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
            placeholder="Min"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
            placeholder="Max"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
          />
        </div>

        {/* Visual Slider */}
        <div className="relative h-1.5 bg-blue-100 rounded-full mt-2 mx-1">
          <div className="absolute left-0 top-0 h-full bg-blue-600 w-2/3 rounded-full"></div>
          <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform"></div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => handlePriceChange(priceRange.min, priceRange.max)}
          className="w-full py-2.5 bg-gray-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-black transition-colors shadow-sm"
        >
          Apply
        </button>

        {/* Quick Tag Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "< $50", min: 0, max: 50 },
            { label: "$50-100", min: 50, max: 100 },
            { label: "$100+", min: 100, max: 1000 },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => handlePriceChange(range.min, range.max)}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="w-5 h-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
              </div>
              <div className="ml-3 flex items-center">
                <div className="flex text-yellow-400 text-sm gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-900 transition-colors">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Separator & Clear Button */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <button
          onClick={onClearFilters}
          className="text-red-500 text-sm font-semibold hover:text-red-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

    </div>
  );
};

export default ProductsSideNav;

