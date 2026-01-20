import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export function createOrder(amount) {
  return razorpay.orders.create({
    amount: amount * 100, // INR to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
}

export function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}
