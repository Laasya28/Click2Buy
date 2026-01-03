import { cn } from "./ui/cn";

const PriceFormat = ({ amount, className }) => {
  const formattedAmount = new Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return <span className={cn(className)}>{formattedAmount}</span>;
};

export default PriceFormat;
