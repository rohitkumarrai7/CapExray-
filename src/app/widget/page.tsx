"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TOOL_PRICING } from "@/lib/pricing-data";

function formatPlanLabel(plan: { name: string; pricePerSeat: number; monthlyPrice: number }) {
  if (plan.pricePerSeat > 0) return `${plan.name} ($${plan.pricePerSeat}/seat)`;
  if (plan.monthlyPrice > 0) return `${plan.name} ($${plan.monthlyPrice}/mo)`;
  return `${plan.name} (Free)`;
}

export default function WidgetPage() {
  const router = useRouter();
  const [toolId, setToolId] = useState("");
  const [plan, setPlan] = useState("");
  const [teamSize, setTeamSize] = useState("5");

  const selectedTool = TOOL_PRICING.find((t) => t.id === toolId);
  const plans = selectedTool?.plans ?? [];

  const handleAudit = () => {
    router.push("/diagnose");
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">AI Spend Audit</h2>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Find out if you&apos;re overpaying for AI tools. Takes 60 seconds.
        </p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Your AI Tool</Label>
            <Select value={toolId} onValueChange={(val) => { setToolId(val as string); setPlan(""); }}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select a tool..." />
              </SelectTrigger>
              <SelectContent>
                {TOOL_PRICING.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {plans.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Current Plan</Label>
              <Select value={plan} onValueChange={(val) => setPlan(val as string)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select plan..." />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {formatPlanLabel(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Team Size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <Button onClick={handleAudit} className="w-full bg-emerald-500 text-zinc-900 hover:bg-emerald-600 font-bold">
            Run Full Audit
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-zinc-500">
          Powered by{" "}
          <a href="https://cap-exray.vercel.app" className="text-emerald-400 underline underline-offset-2">
            CapExray
          </a>
        </p>
      </div>
    </div>
  );
}
