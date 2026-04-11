import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

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
    // Rate limiting — max 5 requests per IP per 5 minutes
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const { allowed, resetAt } = rateLimit(ip, { maxRequests: 5, windowMs: 5 * 60 * 1000 });
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
