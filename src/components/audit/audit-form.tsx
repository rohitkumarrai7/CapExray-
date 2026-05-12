"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight, RefreshCw, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { USE_CASE_LABELS, STARTUP_STAGE_LABELS } from "@/lib/pricing-data";
import { runAudit } from "@/lib/audit-engine";
import type { AuditInput, ToolPricing } from "@/types/audit";

const STORAGE_KEY = "capexray_diagnose_form";

const toolEntrySchema = z.object({
  toolId: z.string().min(1, "Select a tool"),
  plan: z.string().min(1, "Select a plan"),
  monthlySpend: z.number().positive("Enter a valid amount"),
  seats: z.number().int().min(1, "At least 1 seat"),
});

const auditFormSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
  teamSize: z.number().int().min(1, "At least 1 team member"),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  engineeringHeavy: z.boolean(),
  apiUsageLevel: z.enum(["low", "medium", "high"]),
  startupStage: z.enum(["solo", "small-team", "growth", "scale"]),
});

type AuditFormData = z.infer<typeof auditFormSchema>;

const API_USAGE_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

interface PricingResponse {
  tools: ToolPricing[];
  lastVerifiedAt: string | null;
  source: "database" | "static" | "static-fallback";
}

function formatPlanLabel(plan: {
  name: string;
  pricePerSeat: number;
  monthlyPrice: number;
}) {
  if (plan.pricePerSeat > 0) return `${plan.name} — $${plan.pricePerSeat}/seat/mo`;
  if (plan.monthlyPrice > 0) return `${plan.name} — $${plan.monthlyPrice}/mo`;
  return `${plan.name} — Free`;
}

function formatVerifiedDate(iso: string | null): string {
  if (!iso) return "Not yet verified";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AuditForm() {
  const router = useRouter();

  // ── Live pricing state ──────────────────────────────────────────────────
  const [pricingData, setPricingData] = useState<ToolPricing[]>([]);
  const [pricingMeta, setPricingMeta] = useState<{
    lastVerifiedAt: string | null;
    source: string;
  }>({ lastVerifiedAt: null, source: "loading" });
  const [pricingLoading, setPricingLoading] = useState(true);

  const fetchPricing = useCallback(async () => {
    setPricingLoading(true);
    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      if (!res.ok) throw new Error("Pricing fetch failed");
      const json: PricingResponse = await res.json();
      setPricingData(json.tools);
      setPricingMeta({
        lastVerifiedAt: json.lastVerifiedAt,
        source: json.source,
      });
    } catch {
      // Last-resort: import static data directly
      const { TOOL_PRICING } = await import("@/lib/pricing-data");
      setPricingData(TOOL_PRICING);
      setPricingMeta({ lastVerifiedAt: null, source: "static-fallback" });
    } finally {
      setPricingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  // ── Form ────────────────────────────────────────────────────────────────
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: [{ toolId: "", plan: "", monthlySpend: 0, seats: 1 }],
      teamSize: 5,
      primaryUseCase: "coding",
      engineeringHeavy: false,
      apiUsageLevel: "medium",
      startupStage: "small-team",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tools" });
  const watchedTools = watch("tools");

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.tools?.length > 0) reset(parsed);
      }
    } catch {}
  }, [reset]);

  useEffect(() => {
    const sub = watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: AuditFormData) => {
    const result = runAudit(data as AuditInput, pricingData);
    localStorage.setItem("capexray_last_audit", JSON.stringify(result));
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch {}
    router.push("/report/" + result.slug);
  };

  function getPlansForTool(toolId: string) {
    return pricingData.find((t) => t.id === toolId)?.plans ?? [];
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── Pricing freshness indicator ─────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#192121] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            {pricingLoading
              ? "Loading live pricing…"
              : pricingMeta.source === "database"
              ? `Pricing verified ${formatVerifiedDate(pricingMeta.lastVerifiedAt)}`
              : "Pricing from static bundle (DB not seeded)"}
          </span>
          {!pricingLoading && pricingMeta.source === "database" && (
            <span className="size-1.5 rounded-full bg-secondary" />
          )}
        </div>
        <button
          type="button"
          onClick={fetchPricing}
          className="flex items-center gap-1 font-mono text-xs text-primary transition-colors hover:text-primary/80"
          title="Refresh pricing"
        >
          <RefreshCw className={`size-3 ${pricingLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Tools section ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass-card ring-0">
          <CardHeader>
            <CardTitle className="text-xl">Your AI Tools</CardTitle>
            <CardDescription>
              Add every AI tool your team currently uses and your plan details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => {
              const selectedToolId = watchedTools?.[index]?.toolId;
              const selectedPlanName = watchedTools?.[index]?.plan;
              const availablePlans = getPlansForTool(selectedToolId ?? "");

              // Auto-fill monthly spend when plan is selected
              const selectedPlan = availablePlans.find(
                (p) => p.name === selectedPlanName
              );
              const suggestedSpend =
                selectedPlan &&
                (selectedPlan.pricePerSeat > 0
                  ? selectedPlan.pricePerSeat
                  : selectedPlan.monthlyPrice);

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      Tool {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Tool selector */}
                    <div className="space-y-2">
                      <Label>Tool</Label>
                      <Controller
                        name={`tools.${index}.toolId`}
                        control={control}
                        render={({ field: f }) => (
                          <Select
                            value={f.value || ""}
                            onValueChange={(val) => {
                              f.onChange(val);
                              setValue(`tools.${index}.plan`, "");
                              setValue(`tools.${index}.monthlySpend`, 0);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  pricingLoading ? "Loading tools…" : "Select a tool…"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {pricingData.map((tool) => (
                                <SelectItem key={tool.id} value={tool.id}>
                                  {tool.name}
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    — {tool.vendor}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tools?.[index]?.toolId && (
                        <p className="text-xs text-destructive">
                          {errors.tools[index].toolId?.message}
                        </p>
                      )}
                    </div>

                    {/* Plan selector */}
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <Controller
                        name={`tools.${index}.plan`}
                        control={control}
                        render={({ field: f }) => (
                          <Select
                            value={f.value || ""}
                            onValueChange={(val) => {
                              f.onChange(val);
                              // Auto-fill the spend field with the plan's list price
                              const plan = availablePlans.find(
                                (p) => p.name === val
                              );
                              if (plan) {
                                const price =
                                  plan.pricePerSeat > 0
                                    ? plan.pricePerSeat
                                    : plan.monthlyPrice;
                                if (price > 0) {
                                  setValue(
                                    `tools.${index}.monthlySpend`,
                                    price
                                  );
                                }
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  selectedToolId
                                    ? "Select a plan…"
                                    : "Select a tool first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePlans.map((plan) => (
                                <SelectItem key={plan.name} value={plan.name}>
                                  {formatPlanLabel(plan)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tools?.[index]?.plan && (
                        <p className="text-xs text-destructive">
                          {errors.tools[index].plan?.message}
                        </p>
                      )}
                    </div>

                    {/* Monthly spend */}
                    <div className="space-y-2">
                      <Label>
                        Monthly Spend (USD)
                        {suggestedSpend && suggestedSpend > 0 && (
                          <span className="ml-2 font-mono text-xs text-primary">
                            List: ${suggestedSpend}/seat
                          </span>
                        )}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        {...register(`tools.${index}.monthlySpend`, {
                          valueAsNumber: true,
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your actual invoice amount (seats × plan price).
                      </p>
                      {errors.tools?.[index]?.monthlySpend && (
                        <p className="text-xs text-destructive">
                          {errors.tools[index].monthlySpend?.message}
                        </p>
                      )}
                    </div>

                    {/* Seats */}
                    <div className="space-y-2">
                      <Label>Number of Seats / Licenses</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="1"
                        {...register(`tools.${index}.seats`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.tools?.[index]?.seats && (
                        <p className="text-xs text-destructive">
                          {errors.tools[index].seats?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ toolId: "", plan: "", monthlySpend: 0, seats: 1 })
              }
              className="w-full"
              disabled={pricingLoading}
            >
              <Plus className="size-4" />
              Add another tool
            </Button>

            {typeof errors.tools?.message === "string" && (
              <p className="text-sm text-destructive">{errors.tools.message}</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Team context ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="glass-card ring-0">
          <CardHeader>
            <CardTitle className="text-xl">Your Team</CardTitle>
            <CardDescription>
              Context helps us identify plan mismatches and seat over-provisioning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Team Size</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="5"
                  {...register("teamSize", { valueAsNumber: true })}
                />
                {errors.teamSize && (
                  <p className="text-xs text-destructive">{errors.teamSize.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Primary Use Case</Label>
                <Controller
                  name="primaryUseCase"
                  control={control}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select use case…" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(USE_CASE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.primaryUseCase && (
                  <p className="text-xs text-destructive">
                    {errors.primaryUseCase.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Startup Stage</Label>
                <Controller
                  name="startupStage"
                  control={control}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select stage…" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STARTUP_STAGE_LABELS).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.startupStage && (
                  <p className="text-xs text-destructive">
                    {errors.startupStage.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>API Usage Level</Label>
                <Controller
                  name="apiUsageLevel"
                  control={control}
                  render={({ field: f }) => (
                    <div className="flex h-8 items-center gap-6">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <label
                          key={level}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            value={level}
                            checked={f.value === level}
                            onChange={() => f.onChange(level)}
                            className="size-4 accent-primary"
                          />
                          {API_USAGE_LABELS[level]}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <Controller
                name="engineeringHeavy"
                control={control}
                render={({ field: f }) => (
                  <Checkbox
                    checked={f.value ?? false}
                    onCheckedChange={f.onChange}
                  />
                )}
              />
              <span className="text-sm font-medium">Engineering-heavy team?</span>
            </label>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center pb-8"
      >
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || pricingLoading}
          className="bg-primary text-primary-foreground hover:brightness-110"
        >
          {isSubmitting
            ? "Diagnosing…"
            : pricingLoading
            ? "Loading pricing…"
            : "Generate CapExray"}
          {!isSubmitting && !pricingLoading && <ArrowRight className="size-4" />}
        </Button>
      </motion.div>
    </form>
  );
}
