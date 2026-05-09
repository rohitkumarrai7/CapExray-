import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, companyName, role, teamSize, auditId, monthlySavings } = body;

    if (!email || !auditId) {
      return NextResponse.json({ error: "Email and audit ID are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (email.includes("honeypot") || email.length > 254) {
      return NextResponse.json({ ok: true });
    }

    const { error: dbError } = await supabase.from("leads").insert({
      email,
      company_name: companyName || null,
      role: role || null,
      team_size: teamSize || null,
      audit_id: auditId,
      monthly_savings: monthlySavings || 0,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const savingsText = monthlySavings > 0
          ? `Your audit found potential savings of $${monthlySavings.toLocaleString()}/month ($${(monthlySavings * 12).toLocaleString()}/year).`
          : "Your AI stack is already well-optimized.";

        const credexCta = monthlySavings > 500
          ? `\n\nBecause your savings potential is significant, the Credex team may reach out to help you capture additional savings through discounted AI infrastructure credits.`
          : "";

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "CapExray <audit@capexray.app>",
            to: [email],
            subject: monthlySavings > 0
              ? `Your AI Spend Audit — $${monthlySavings.toLocaleString()}/mo in potential savings`
              : "Your AI Spend Audit — You're spending efficiently!",
            text: `Thanks for using CapExray!\n\n${savingsText}${credexCta}\n\nView your full audit results anytime at our site.\n\n— The CapExray Team`,
          }),
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
