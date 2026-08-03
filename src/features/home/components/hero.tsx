"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PUBLIC_ROUTES } from "@/lib/routes";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`${PUBLIC_ROUTES.SERVICES}${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="from-primary/[0.06] via-background to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-border bg-secondary/60 text-muted-foreground mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs"
          >
            <ShieldCheck className="text-success size-3.5" />
            Verified technicians · Secure payments
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl"
          >
            A trusted pro for every job around the house.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-muted-foreground mx-auto mt-4 max-w-lg text-base sm:text-lg"
          >
            Book electricians, plumbers, and technicians near you — clear
            pricing up front, real reviews, and secure payment when the job is
            done.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            onSubmit={handleSearch}
            className="border-border bg-card mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-xl border p-1.5 shadow-sm"
          >
            <Search className="text-muted-foreground ml-2 size-4 shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a service — e.g. wiring, leak repair…"
              className="border-0 shadow-none focus-visible:ring-0"
              aria-label="Search services"
            />
            <Button type="submit" className="shrink-0 gap-1.5">
              <Zap className="size-4" />
              Find a pro
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
