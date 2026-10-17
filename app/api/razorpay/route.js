/**
 * ============================================================================
 * ----------------------------------------------------------------------------
 * ULTRA-HIGH SECURITY FIXES:
 * 1. Input Sanitization: mongo-sanitize applied to all incoming request fields.
 * 2. Timing-Safe Equal: Avoids timing attack vectors on signature comparison.
 * 3. strict DB Verification: Removed 'upsert: true' to prevent fake entry generation.
 * 4. Secure 303 Redirect for browser POST submissions from Razorpay.
 * ============================================================================
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import sanitize from "mongo-sanitize"; // 🔒 Sanitizer import kiya
import Payment from "@/models/Payment";
import connectDb, { isDbConnected } from "@/db/connectDb";
import User from "@/models/User";
import { completePaymentInFallback } from "@/actions/useractions";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  try {
    await connectDb();

    let raw_order_id = null;
    let raw_payment_id = null;
    let raw_signature = null;
    let isJsonRequest = false;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      isJsonRequest = true;
      const body = await req.json();
      raw_order_id = body.razorpay_order_id;
      raw_payment_id = body.razorpay_payment_id;
      raw_signature = body.razorpay_signature;
    } else {
      // Browser form submission from Razorpay callback_url
      const formData = await req.formData();
      raw_order_id = formData.get("razorpay_order_id");
      raw_payment_id = formData.get("razorpay_payment_id");
      raw_signature = formData.get("razorpay_signature");
    }

    // 🔒 1. Input Sanitization against NoSQL Injections
    const razorpay_order_id = sanitize(raw_order_id);
    const razorpay_payment_id = sanitize(raw_payment_id);
    const razorpay_signature = sanitize(raw_signature);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      if (isJsonRequest) {
        return NextResponse.json(
          { success: false, message: "Missing Razorpay verification parameters" },
          { status: 400 }
        );
      }
      return NextResponse.redirect(`${req.nextUrl.origin}/?error=missing_params`, 303);
    }

    // 2. Locate payment record securely
    let paymentRecord = null;
    if (isDbConnected()) {
      try {
        paymentRecord = await Payment.findOne({ oid: razorpay_order_id });
      } catch (err) {
        console.warn("[Razorpay Route] DB lookup error:", err.message);
      }
    }

    // User check ko sanitize kiya
    const to_user = sanitize(paymentRecord?.to_user || "shiva");

    // 3. Fetch creator's secret or fallback securely
    let secret = process.env.RAZORPAY_KEY_SECRET;
    if (paymentRecord && isDbConnected()) {
      try {
        const creator = await User.findOne({ username: to_user });
        if (creator?.razorpaysecret) {
          secret = creator.razorpaysecret;
        }
      } catch (e) {
        console.warn("[Razorpay Route] User secret lookup error:", e.message);
      }
    }

    if (!secret) {
      console.error("[Razorpay Route] Razorpay secret key missing from environment!");
      return NextResponse.json(
        { success: false, message: "Server configuration error: missing secret key" },
        { status: 500 }
      );
    }

    // 4. Cryptographic Signature Verification (HMAC-SHA256)
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 🔒 5. Timing-Safe Comparison (Prevents Timing Attacks)
    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf-8");

    let isAuthentic = false;
    if (expectedBuffer.length === receivedBuffer.length) {
      isAuthentic = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    }

    if (!isAuthentic) {
      console.error("[Razorpay Route] Signature mismatch! Security warning generated.");

      if (isJsonRequest) {
        return NextResponse.json(
          { success: false, message: "Payment verification failed: invalid signature" },
          { status: 400 }
        );
      }
      return NextResponse.redirect(`${req.nextUrl.origin}/${to_user}?error=payment_verification_failed`, 303);
    }

    // 🔒 6. Update Payment status to verified (Removed upsert:true to avoid fake database injections)
    if (isDbConnected()) {
      try {
        const updatedPayment = await Payment.findOneAndUpdate(
          { oid: razorpay_order_id },
          { done: true, paymentId: razorpay_payment_id, updatedAt: new Date() },
          { new: true, upsert: false } // False kiya tak fake entries generate na ho
        );

        if (!updatedPayment) {
          console.warn("[Razorpay Route] Order ID mismatch. Payment verified but order not found in DB.");
        }
      } catch (dbErr) {
        console.warn("[Razorpay Route] Could not update DB payment, updating fallback store:", dbErr.message);
        await completePaymentInFallback(razorpay_order_id, razorpay_payment_id);
      }
    } else {
      await completePaymentInFallback(razorpay_order_id, razorpay_payment_id);
    }

    console.log(`[Razorpay Route] ✅ Payment ${razorpay_payment_id} for order ${razorpay_order_id} verified successfully!`);

    // 7. Response handling
    if (isJsonRequest) {
      return NextResponse.json({
        success: true,
        message: "Payment successfully verified!",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    }

    return NextResponse.redirect(`${req.nextUrl.origin}/${to_user}?paymentdone=true`, 303);
  } catch (error) {
    console.error("[Razorpay Route Exception]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
};
