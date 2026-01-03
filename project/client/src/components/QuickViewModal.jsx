import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import PriceContainer from "./PriceContainer";

const QuickViewModal = ({ isOpen, onClose, item }) => {
    const navigate = useNavigate();
    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <FaTimes className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src={item?.images?.[0] || item?.image}
                                        alt={item?.name}
                                        className="max-w-full max-h-full object-contain p-4 drop-shadow-md"
                                    />
                                </div>

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {item?.offer && (
                                        <span className="bg-black text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                                            {item?.discountedPercentage > 0
                                                ? `-${item.discountedPercentage}%`
                                                : "Sale"}
                                        </span>
                                    )}
                                    {item?.badge && (
                                        <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-4">
                                    {item?.name}
                                </h2>

                                {/* Price */}
                                <div className="mb-6">
                                    <PriceContainer item={item} />
                                </div>

                                {/* Brand and Category */}
                                <div className="space-y-2 mb-6">
                                    {item?.brand && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Brand:</span> {item.brand}
                                        </p>
                                    )}
                                    {item?.category && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Category:</span>{" "}
                                            {item.category}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                {item?.description && (
                                    <div className="mb-6 overflow-hidden">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                                            Description
                                        </h3>
                                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                                            {item.description}
                                        </p>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <div className="mt-auto">
                                    <AddToCartButton item={item} />
                                </div>

                                {/* View Full Details Link */}
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate(`/product/${item._id}`, { state: { item } });
                                    }}
                                    className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                                >
                                    View Full Details →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

QuickViewModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
    }),
};

export default QuickViewModal;
