import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../redux/orebiSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { cn } from "./ui/cn";

const AddToCartButton = ({ item, className }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.orebiReducer);
  const [existingProduct, setExistingProduct] = useState(null);
  useEffect(() => {
    const availableItem = products.find(
      (product) => product?._id === item?._id
    );

    setExistingProduct(availableItem || null);
  }, [products, item]);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(`${item?.name.substring(0, 10)}... is added successfully!`);
  };

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      {existingProduct ? (
        <div className="flex items-center justify-between bg-slate-50 rounded-full px-2 py-1.5 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-md animate-in fade-in zoom-in duration-300">
          <button
            onClick={() => {
              dispatch(decreaseQuantity(item?._id));
              if (existingProduct?.quantity === 1) {
                toast.success("Removed from cart");
              } else {
                toast.success("Quantity decreased");
              }
            }}
            className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-90"
          >
            <FaMinus className="w-2.5 h-2.5" />
          </button>

          <span className="text-sm font-bold text-slate-800 tabular-nums">
            {existingProduct?.quantity || 0}
          </span>

          <button
            onClick={() => {
              dispatch(increaseQuantity(item?._id));
              toast.success("Quantity increased");
            }}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-90"
          >
            <FaPlus className="w-2.5 h-2.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full group relative h-12 flex items-center justify-center bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Add to cart
            <FaPlus className="w-2 h-2 transition-transform duration-300 group-hover:rotate-90" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      )}
    </div>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default AddToCartButton;
