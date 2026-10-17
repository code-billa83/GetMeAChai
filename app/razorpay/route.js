import { POST as apiPost } from "@/app/api/razorpay/route";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  return apiPost(req);
};