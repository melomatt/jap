import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit"; // Import the updated async helper

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  date: z.string().min(1),
  matter: z.string().min(1),
  message: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Retrieve the client IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    // 2. Perform the serverless-compatible rate limit check
    const { allowed, resetAt } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const body = await req.json();
    const parsed = bookingSchema.parse(body);

    // Save evaluation booking to database securely using Admin role
    const adminSupabase = createAdminClient();
    const { error: dbError } = await adminSupabase.from("evaluations").insert({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      date: parsed.date,
      matter: parsed.matter,
      message: parsed.message || "",
      status: "pending"
    });

    if (dbError) {
      console.error("Failed to insert evaluation into database:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/book-appointment error", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 422 });
    }

    return NextResponse.json({ error: "Failed to submit booking request" }, { status: 500 });
  }
}
