import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import toast from "react-hot-toast";
import { addToWishlist, deleteFromWishlist } from "../redux/orebiSlice";
import AddToCartButton from "./AddToCartButton";
import PriceContainer from "./PriceContainer";
import QuickViewModal from "./QuickViewModal";

const ProductCard = ({ item, viewMode = "grid", className = "" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favoriteProducts } = useSelector((state) => state.orebiReducer);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isFavorite = favoriteProducts.some((p) => p._id === item?._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(deleteFromWishlist(item._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(item));
      toast.success("Added to wishlist");
    }
  };

  const handleProductDetails = () => {
    navigate(`/product/${item?._id}`, {
      state: { item: item },
    });
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  if (viewMode === "list") {
    return (
      <div
        className={`w-full group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row p-6 gap-8 items-center">
          {/* List Image Container */}
          <div className="relative w-full md:w-72 aspect-square flex-shrink-0 bg-slate-50/50 rounded-[2rem] overflow-hidden group-hover:bg-slate-50 transition-colors duration-500">
            <div
              onClick={handleProductDetails}
              className="relative w-full h-full cursor-pointer flex items-center justify-center p-10 transition-transform duration-700 group-hover:scale-105"
            >
              <img
                className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
                src={item?.images?.[0] || item?.image}
                alt={item?.name}
              />
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={handleWishlist}
              className={`absolute top-5 right-5 p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/20 transition-all duration-500 z-10 ${isFavorite ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500 hover:scale-110"}`}
            >
              {isFavorite ? <MdFavorite className="w-5 h-5" /> : <MdFavoriteBorder className="w-5 h-5" />}
            </button>

            {item?.offer && (
              <div className="absolute top-5 left-5 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                {item?.discountedPercentage}% Off
              </div>
            )}
          </div>

          {/* List Info Container */}
          <div className="flex-1 space-y-4 pr-4 py-2">
            <div>
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase mb-2 block">{item?.brand || "Garnier"}</span>
              <h2
                onClick={handleProductDetails}
                className="text-2xl font-bold text-slate-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
              >
                {item?.name}
              </h2>
            </div>

            <p className="text-slate-500 font-medium text-sm line-clamp-2 max-w-xl leading-relaxed">
              {item.description || "Experience superior quality and modern design in every detail of this exclusive product."}
            </p>

            <div className="pt-2">
              <PriceContainer item={item} className="text-2xl font-black text-slate-900" />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <AddToCartButton item={item} className="max-w-[220px]" />
              <button
                onClick={handleQuickView}
                className="h-12 w-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-all hover:scale-105 active:scale-95 border border-slate-100"
                title="Quick View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <>
      <div
        className={`w-full group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:-translate-y-2 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Section - Image Centered */}
        <div className="relative aspect-[4/5] bg-slate-50/50 flex items-center justify-center p-8 overflow-hidden group-hover:bg-slate-50 transition-colors duration-700">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-5 right-5 p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/20 transition-all duration-500 z-10 ${isFavorite ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500 hover:scale-110"} ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
          >
            {isFavorite ? <MdFavorite className="w-5 h-5" /> : <MdFavoriteBorder className="w-5 h-5" />}
          </button>

          {item?.offer && (
            <div className={`absolute top-5 left-5 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest transition-all duration-500 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
              {item?.discountedPercentage}% Off
            </div>
          )}

          <div
            onClick={handleProductDetails}
            className="w-full h-full cursor-pointer transition-transform duration-1000 group-hover:scale-110 flex items-center justify-center"
          >
            <img
              className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-700"
              src={item?.images?.[0] || item?.image}
              alt={item?.name}
            />
          </div>

          {/* Quick Look Hidden until hover */}
          <button
            onClick={handleQuickView}
            className={`absolute bottom-6 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-2xl border border-white/20 transition-all duration-500 z-10 hover:bg-slate-900 hover:text-white ${isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"}`}
          >
            Quick View
          </button>
        </div>

        {/* Info Section */}
        <div className="p-7 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">{item?.brand || "Garnier"}</span>
            {item?.badge && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="In Stock" />
            )}
          </div>

          <h3
            onClick={handleProductDetails}
            className="text-lg font-bold text-slate-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-1 mb-2"
          >
            {item?.name}
          </h3>

          <div className="mb-6">
            <PriceContainer item={item} className="text-2xl font-black text-slate-900 tabular-nums" />
          </div>

          {/* Action Section - Modern Pill Button */}
          <AddToCartButton item={item} />
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        item={item}
      />
    </>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    offer: PropTypes.bool,
    badge: PropTypes.bool,
    discountedPercentage: PropTypes.number,
    brand: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.oneOf(["grid", "list"]),
  className: PropTypes.string,
};

export default ProductCard;
