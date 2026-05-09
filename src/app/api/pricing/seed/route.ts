/**
 * POST /api/pricing/seed
 *
 * Seeds (or refreshes) the Supabase `pricing_data` table from the static
 * pricing-data.ts source of truth. Run this once after DB setup, and again
 * whenever vendor pricing changes.
 *
 * This is an internal/admin endpoint — protect it with SEED_SECRET in .env
 * if you deploy publicly.
 *
 * SQL migration to run in Supabase SQL editor:
 * ─────────────────────────────────────────────
 * create table if not exists pricing_data (
 *   id              uuid    default gen_random_uuid() primary key,
 *   tool_id         text    not null unique,
 *   tool_name       text    not null,
 *   vendor          text    not null,
 *   category        text    not null,
 *   icon            text,
 *   url             text    not null,
 *   has_api_option  boolean default false,
 *   api_pricing     text,
 *   plans           jsonb   not null,
 *   last_verified_at timestamptz default now(),
 *   updated_at      timestamptz default now()
 * );
 * alter table pricing_data enable row level security;
 * create policy "Public read" on pricing_data for select using (true);
 * ─────────────────────────────────────────────
 */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TOOL_PRICING } from "@/lib/pricing-data";

const SEED_SECRET = process.env.SEED_SECRET ?? "capexray-seed";

export async function POST(req: NextRequest) {
  // Basic secret check — prevents accidental public triggers
  const auth = req.headers.get("x-seed-secret");
  if (auth !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = TOOL_PRICING.map((tool) => ({
      tool_id: tool.id,
      tool_name: tool.name,
      vendor: tool.vendor,
      category: tool.category,
      icon: tool.icon,
      url: tool.url,
      has_api_option: tool.hasApiOption,
      api_pricing: tool.apiPricing ?? null,
      plans: tool.plans,
      last_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error, count } = await supabase
      .from("pricing_data")
      .upsert(rows, { onConflict: "tool_id", count: "exact" });

    if (error) {
      console.error("[/api/pricing/seed] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      upserted: count,
      tools: rows.map((r) => r.tool_id),
      lastVerifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[/api/pricing/seed] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
