"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export function CtaSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12"
      >
        <Wrench className="absolute -top-6 -right-6 size-40 rotate-12 opacity-[0.07]" />
        <h2 className="font-display mx-auto max-w-xl text-2xl font-semibold sm:text-3xl">
          {isAuthenticated
            ? "Ready to get something fixed?"
            : "Join FixItNow and get things fixed, fast."}
        </h2>
        <p className="text-primary-foreground/80 mx-auto mt-3 max-w-md text-sm sm:text-base">
          Browse verified technicians, compare pricing, and book in minutes.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" asChild className="gap-1.5">
            <Link href={PUBLIC_ROUTES.SERVICES}>
              Browse services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {!isAuthenticated && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
            >
              <Link href={AUTH_ROUTES.REGISTER}>Create a free account</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
