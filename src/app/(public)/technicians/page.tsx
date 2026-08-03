import type { Metadata } from "next";
import { TechniciansPageContent } from "@/app/(public)/technicians/technicians-page-content";

export const metadata: Metadata = {
  title: "Find a technician",
  description: "Browse verified electricians, plumbers, and technicians on FixItNow.",
};

export default function TechniciansPage() {
  return <TechniciansPageContent />;
}
