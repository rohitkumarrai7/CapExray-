/**
 * GET /api/pricing
 *
 * Returns the live pricing data stored in Supabase (pricing_data table).
 * Falls back to the static pricing-data.ts if Supabase is unavailable.
 *
 * Each row includes a `last_verified_at` timestamp so the UI can surface
 * exactly when each tool's pricing was last checked against the vendor page.
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TOOL_PRICING } from "@/lib/pricing-data";

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pricing_data")
      .select("*")
      .order("tool_name", { ascending: true });

    if (error || !data || data.length === 0) {
      // Supabase unavailable or table not seeded — serve static data with a flag
      return NextResponse.json(
        {
          tools: TOOL_PRICING,
          lastVerifiedAt: null,
          source: "static",
          message: "Pricing served from static bundle. Seed the DB at POST /api/pricing/seed.",
        },
        {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
        }
      );
    }

    // Reshape DB rows back to ToolPricing interface expected by the audit engine
    const tools = data.map((row) => ({
      id: row.tool_id,
      name: row.tool_name,
      vendor: row.vendor,
      category: row.category,
      icon: row.icon ?? row.tool_id,
      url: row.url,
      hasApiOption: row.has_api_option ?? false,
      apiPricing: row.api_pricing ?? undefined,
      plans: row.plans ?? [],
      lastVerifiedAt: row.last_verified_at,
    }));

    const oldestVerification = data.reduce(
      (oldest, row) =>
        !oldest || row.last_verified_at < oldest ? row.last_verified_at : oldest,
      data[0]?.last_verified_at as string | null
    );

    return NextResponse.json(
      {
        tools,
        lastVerifiedAt: oldestVerification,
        source: "database",
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      }
    );
  } catch (err) {
    console.error("[/api/pricing] Error:", err);
    // Always have a fallback — never break the form
    return NextResponse.json({
      tools: TOOL_PRICING,
      lastVerifiedAt: null,
      source: "static-fallback",
    });
  }
}
