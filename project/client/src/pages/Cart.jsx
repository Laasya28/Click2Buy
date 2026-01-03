import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  resetCart,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  setOrderCount,
} from "../redux/orebiSlice";
import { emptyCart } from "../assets/images";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import CheckoutStepper from "../components/CheckoutStepper";
import toast from "react-hot-toast";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.orebiReducer.products);
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const orderCount = useSelector((state) => state.orebiReducer.orderCount);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Cart calculations
  const [totalAmt, setTotalAmt] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Address form
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholderName: "",
  });
  const [upiId, setUpiId] = useState("");

  // Order success
  const [orderId, setOrderId] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate totals
  useEffect(() => {
    let regularPrice = 0;
    let finalPrice = 0;
    products.forEach((item) => {
      const itemPrice = item?.price || 0;
      const itemQuantity = item?.quantity || 1;
      const itemDiscountPercentage = item?.discountedPercentage || 0;

      regularPrice += itemPrice * itemQuantity;
      finalPrice +=
        (itemPrice - (itemDiscountPercentage * itemPrice) / 100) * itemQuantity;
    });
    setTotalAmt(regularPrice);
    setDiscount(finalPrice);
  }, [products]);

  // Fetch location by pincode
  const fetchLocationByPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setLoadingLocation(true);
    setPincodeError("");

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        setAddressForm((prev) => ({
          ...prev,
          city: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        }));
      } else {
        setPincodeError("Invalid pincode");
        setAddressForm((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      setPincodeError("Failed to fetch location");
      setAddressForm((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    } finally {
      setLoadingLocation(false);
    }
  };

  // Handle pincode change
  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAddressForm({ ...addressForm, pincode: value });

    if (value.length === 6) {
      fetchLocationByPincode(value);
    } else {
      setAddressForm((prev) => ({ ...prev, city: "", state: "" }));
      setPincodeError("");
    }
  };

  // Validate and proceed to next step
  const handleProceedToAddress = () => {
    if (!userInfo) {
      toast.error("Please login to continue");
      navigate("/signin");
      return;
    }
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handleProceedToPayment = () => {
    // Validate address form
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.houseNo ||
      !addressForm.street ||
      !addressForm.pincode ||
      !addressForm.city ||
      !addressForm.state
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    if (addressForm.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    // Validate payment method
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiry ||
        !cardDetails.cvv ||
        !cardDetails.cardholderName
      ) {
        toast.error("Please fill all card details");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter UPI ID");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      // Validate token exists
      if (!token) {
        toast.error("Please login again to continue");
        navigate("/signin");
        return;
      }

      const response = await fetch("http://localhost:8000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: products,
          amount: discount,
          address: {
            firstName: addressForm.fullName.split(" ")[0] || addressForm.fullName,
            lastName: addressForm.fullName.split(" ").slice(1).join(" ") || ".",
            email: userInfo.email,
            phone: addressForm.phone,
            street: `${addressForm.houseNo}, ${addressForm.street}`,
            city: addressForm.city,
            state: addressForm.state,
            zipcode: addressForm.pincode,
            country: "India",
          },
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      // Check for authentication errors
      if (response.status === 401 || data.message?.includes("token") || data.message?.includes("authentication")) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      if (data.success) {
        // Generate order details
        const newOrderId = `ORD${Date.now()}`;
        setOrderId(newOrderId);

        // Calculate delivery date (5-7 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 6);
        setEstimatedDelivery(
          deliveryDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );

        dispatch(setOrderCount(orderCount + 1));
        setCurrentStep(4);
        window.scrollTo(0, 0);
      } else {
        console.error("Order creation failed:", data);
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleQuantityChange = (id, action) => {
    if (action === "increase") {
      dispatch(increaseQuantity(id));
    } else {
      dispatch(decreaseQuantity(id));
    }
  };

  const handleRemoveItem = (id, name) => {
    dispatch(deleteItem(id));
    toast.success(`${name} removed from cart!`);
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (products.length === 0 && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container className="py-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-12">
              <img
                className="w-32 h-32 mx-auto mb-6 object-cover"
                src={emptyCart}
                alt="Empty Cart"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>
              <Link to="/shop">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">
            Complete your purchase in {4 - currentStep + 1} simple steps
          </p>
        </Container>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <CheckoutStepper currentStep={currentStep} />
        </Container>
      </div>

      <Container className="py-8">
        {/* STEP 1: CART ITEMS */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Shopping Cart ({products.length} items)
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {products.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item._id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item?.images?.[0] || item?.image}
                            alt={item?.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 mb-1">
                            {item?.name}
                          </h3>
                        </Link>
                        {item?.category && (
                          <p className="text-sm text-gray-600 mb-2">
                            {item.category}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, "decrease")
                              }
                              disabled={(item?.quantity || 1) <= 1}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center border-x border-gray-300">
                              {item?.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, "increase")
                              }
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                <PriceFormat
                                  amount={
                                    (item?.price || 0) * (item?.quantity || 1)
                                  }
                                />
                              </div>
                              {item?.discountedPercentage > 0 && (
                                <div className="text-sm text-gray-500 line-through">
                                  <PriceFormat
                                    amount={
                                      (item?.price || 0) *
                                      (item?.quantity || 1) *
                                      (1 +
                                        (item?.discountedPercentage || 0) / 100)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item._id, item.name)
                              }
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    <PriceFormat amount={totalAmt} />
                  </span>
                </div>
                {totalAmt !== discount && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-green-600">
                      -<PriceFormat amount={totalAmt - discount} />
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 pt-4">
                  <span>Total:</span>
                  <span>
                    <PriceFormat amount={discount} />
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 flex gap-4">
                <Link to="/shop" className="flex-1">
                  <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Continue Shopping
                  </button>
                </Link>
                <button
                  onClick={handleProceedToAddress}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Address
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ADDRESS FORM */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery Address
              </h2>

              <form className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                {/* House/Flat No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House / Flat No *
                  </label>
                  <input
                    type="text"
                    value={addressForm.houseNo}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, houseNo: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building name, flat/house number"
                    required
                  />
                </div>

                {/* Street/Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street / Area *
                  </label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street name, area, locality"
                    required
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={handlePincodeChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${pincodeError ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="6-digit pincode"
                    required
                  />
                  {loadingLocation && (
                    <p className="text-sm text-blue-600 mt-1">
                      Fetching location...
                    </p>
                  )}
                  {pincodeError && (
                    <p className="text-sm text-red-600 mt-1">{pincodeError}</p>
                  )}
                </div>

                {/* City (Auto-filled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-filled from pincode"
                  />
                </div>

                {/* State (Auto-filled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-filled from pincode"
                  />
                </div>
              </form>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to Cart
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PAYMENT */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>

              {/* Payment Options */}
              <div className="space-y-4 mb-6">
                {/* UPI */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "upi"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="w-4 h-4"
                    />
                    <FaMobileAlt className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">UPI</span>
                  </div>
                  {paymentMethod === "upi" && (
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter UPI ID (e.g., name@upi)"
                    />
                  )}
                </div>

                {/* Credit/Debit Card */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "card"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4"
                    />
                    <FaCreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      Credit / Debit Card
                    </span>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="space-y-3 mt-4">
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Card Number (16 digits)"
                        maxLength="19"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: formatExpiry(e.target.value),
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        <input
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="CVV"
                          maxLength="3"
                        />
                      </div>
                      <input
                        type="text"
                        value={cardDetails.cardholderName}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardholderName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Cardholder Name"
                      />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4"
                    />
                    <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({products.length}):</span>
                    <PriceFormat amount={discount} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                    <span>Total:</span>
                    <PriceFormat amount={discount} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ORDER SUCCESS */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been confirmed.
              </p>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-semibold text-gray-900">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-900">
                      <PriceFormat amount={discount} />
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Delivery
                    </p>
                    <p className="font-semibold text-gray-900">
                      {estimatedDelivery}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-gray-900">
                      {addressForm.fullName}
                      <br />
                      {addressForm.houseNo}, {addressForm.street}
                      <br />
                      {addressForm.city}, {addressForm.state} -{" "}
                      {addressForm.pincode}
                      <br />
                      Phone: {addressForm.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link to="/orders" className="flex-1">
                  <button
                    onClick={() => dispatch(resetCart())}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View My Orders
                  </button>
                </Link>
                <Link to="/shop" className="flex-1">
                  <button
                    onClick={() => dispatch(resetCart())}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
