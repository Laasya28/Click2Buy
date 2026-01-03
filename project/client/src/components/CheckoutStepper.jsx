import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

const CheckoutStepper = ({ currentStep }) => {
    const steps = [
        { number: 1, label: "Cart" },
        { number: 2, label: "Address" },
        { number: 3, label: "Payment" },
        { number: 4, label: "Confirmation" },
    ];

    return (
        <div className="w-full py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                        <div
                            className="h-full bg-green-600 transition-all duration-500 ease-out"
                            style={{
                                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            }}
                        />
                    </div>

                    {/* Steps */}
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isActive = currentStep === step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center">
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${isCompleted
                                            ? "bg-green-600 text-white"
                                            : isActive
                                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <FaCheck className="w-4 h-4" />
                                    ) : (
                                        step.number
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${isActive
                                            ? "text-blue-600"
                                            : isCompleted
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

CheckoutStepper.propTypes = {
    currentStep: PropTypes.number.isRequired,
};

export default CheckoutStepper;
