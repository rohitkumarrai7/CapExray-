"use client";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AuditForm } from "@/components/audit/audit-form";
import { motion } from "framer-motion";

export default function DiagnosePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight gradient-text md:text-5xl">
              Diagnose Your AI Stack
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Enter your current AI tools and spending. We&apos;ll run the
              diagnosis.
            </p>
          </motion.div>
          <AuditForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
