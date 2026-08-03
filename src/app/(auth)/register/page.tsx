import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a FixItNow account as a customer booking services or a technician offering them.",
};

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join FixItNow as a customer or a technician in under a minute.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
