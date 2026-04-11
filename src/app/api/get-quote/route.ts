import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const quoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  matter: z.string().min(1),
  budget: z.string().min(1),
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
    const parsed = quoteSchema.parse(body);

    const adminSupabase = createAdminClient();
    
    // Insert into Supabase natively (bypass RLS for safety during server action or let it insert since anyone can insert)
    await adminSupabase.from('quotes').insert([{
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        matter: parsed.matter,
        budget: parsed.budget,
        message: parsed.message || null,
        status: 'new'
    }]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/get-quote error", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 422 });
    }

    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
  }
}
