import { createOrder, verifySignature } from "../services/razorpay.service.js";

export async function createPaymentOrder(req, res) {
  try {
    const { plan } = req.body;

    const pricing = {
      medium: 399,
      pro: 699,
    };

    if (!pricing[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const order = await createOrder(pricing[plan]);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // safe to send
    });
  } catch (error) {
    console.error("Payment order error:", error);
    res.status(500).json({ error: "Payment order failed" });
  }
}

export async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    res.json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
}
