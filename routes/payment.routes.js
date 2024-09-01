import { Router } from "express";
import {
  allPayments,
  buySubscription,
  cancelSubscription,
  getRazorpayApiKey,
  verifySubscription,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/razorpay-key").get(getRazorpayApiKey);

router.route("/subscribe").post(buySubscription);

router.route("/verify").post(verifySubscription);

router.route("/unsubscribe").post(cancelSubscription);

router.route("/").get(allPayments);

export default router;
