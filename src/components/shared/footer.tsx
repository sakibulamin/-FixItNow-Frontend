import Link from "next/link";
import { Facebook, Instagram, Linkedin, Wrench } from "lucide-react";
import { PUBLIC_ROUTES, AUTH_ROUTES } from "@/lib/routes";

const EXPLORE_LINKS = [
  { href: PUBLIC_ROUTES.HOME, label: "Home" },
  { href: PUBLIC_ROUTES.SERVICES, label: "Browse services" },
  { href: PUBLIC_ROUTES.TECHNICIANS, label: "Find technicians" },
];

const ACCOUNT_LINKS = [
  { href: AUTH_ROUTES.LOGIN, label: "Sign in" },
  { href: AUTH_ROUTES.REGISTER, label: "Create an account" },
];

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <Wrench className="size-4" />
              </span>
              <span className="font-display text-lg font-semibold">FixItNow</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-sm">
              Book verified electricians, plumbers, and home service technicians
              near you — transparent pricing, real reviews, secure payments.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="FixItNow on Facebook"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                aria-label="FixItNow on Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#"
                aria-label="FixItNow on LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold">Account</p>
            <ul className="mt-4 space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <p className="font-mono">Trusted home services, on your schedule.</p>
        </div>
      </div>
    </footer>
  );
}
