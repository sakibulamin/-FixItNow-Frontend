"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { useCreateTechnicianProfileMutation } from "@/features/technicians/hooks";
import {technicianProfileSchema,
  type TechnicianProfileFormValues,
} from "@/features/technicians/schema";

export function CreateTechnicianProfileForm() {
  const { user } = useAuth();

  const form = useForm<TechnicianProfileFormValues>({
    resolver: zodResolver(technicianProfileSchema),
    defaultValues: { bio: "", skills: "", experience: 0, hourlyRate: 0, location: "" },
  });

  const createProfile = useCreateTechnicianProfileMutation({
    onSuccess: () => {
      toast.success("Technician profile created!");
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't create your technician profile.");
    },
  });

  function onSubmit(values: TechnicianProfileFormValues) {
    if (!user) return;
    createProfile.mutate({
      userId: user.id,
      bio: values.bio || undefined,
      skills: values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      experience: values.experience,
      hourlyRate: values.hourlyRate,
      location: values.location,
    });
  }

  return (
    <Card className="mx-auto max-w-xl p-6">
      <CardContent className="p-0">
        <div className="mb-5 flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <Wrench className="text-primary size-5" />
          </div>
          <div>
            <p className="font-display font-semibold">Set up your technician profile</p>
            <p className="text-muted-foreground text-sm">
              This is what customers see before booking you.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell customers about your experience…" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Wiring, Panel repair, Lighting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of experience</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly rate (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dhaka, Gulshan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createProfile.isPending} className="w-full gap-2">
              {createProfile.isPending && <Loader2 className="size-4 animate-spin" />}
              {createProfile.isPending ? "Creating profile…" : "Create profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
