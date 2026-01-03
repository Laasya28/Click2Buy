import express from "express";
import {
  processMockPayment,
  createOrder,
} from "../controllers/paymentController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

const routeValue = "/api/payment/";

// Create order
router.post("/api/order/create", userAuth, createOrder);

// Mock payment route
router.post(
  `${routeValue}process-mock-payment`,
  userAuth,
  processMockPayment
);

export default router;
