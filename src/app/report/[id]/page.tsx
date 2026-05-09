"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AuditResults } from "@/components/audit/audit-results";
import type { AuditResult } from "@/types/audit";

export default function ReportPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("capexray_last_audit");
      if (stored) {
        const parsed: AuditResult = JSON.parse(stored);
        requestAnimationFrame(() => setResult(parsed));
      } else {
        router.replace("/diagnose");
      }
    } catch {
      router.replace("/diagnose");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center pt-16">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Analyzing stack...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <AuditResults result={result} />
      </main>
      <Footer />
    </div>
  );
}
