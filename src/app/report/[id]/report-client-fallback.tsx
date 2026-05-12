"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AuditResults } from "@/components/audit/audit-results";
import type { AuditResult } from "@/types/audit";

function loadStoredAudit(): AuditResult | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("capexray_last_audit");
    if (stored) return JSON.parse(stored) as AuditResult;
  } catch {}
  return null;
}

export function ReportClientFallback() {
  const router = useRouter();
  const [result] = useState<AuditResult | null>(loadStoredAudit);

  useEffect(() => {
    if (!result) {
      router.replace("/diagnose");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center pt-16">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Redirecting...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16">
        <AuditResults result={result} />
      </main>
      <Footer />
    </>
  );
}
