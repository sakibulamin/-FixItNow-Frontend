"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateTechnicianProfileMutation } from "@/features/technicians/hooks";
import {
  technicianProfileSchema,
  type TechnicianProfileFormValues,
} from "@/features/technicians/schema";
import type { TechnicianProfile } from "@/types/technician";

export function EditTechnicianProfileForm({ profile }: { profile: TechnicianProfile }) {
  const form = useForm<TechnicianProfileFormValues>({
    resolver: zodResolver(technicianProfileSchema),
    defaultValues: {
      bio: profile.bio ?? "",
      skills: profile.skills.join(", "),
      experience: profile.experience,
      hourlyRate: profile.hourlyRate,
      location: profile.location,
    },
  });

  const updateProfile = useUpdateTechnicianProfileMutation({
    onSuccess: () => {
      toast.success("Technician profile updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't update your technician profile.");
    },
  });

  function onSubmit(values: TechnicianProfileFormValues) {
    updateProfile.mutate({
      id: profile.id,
      payload: {
        bio: values.bio || undefined,
        skills: values.skills
          ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        experience: values.experience,
        hourlyRate: values.hourlyRate,
        location: values.location,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Tell customers about your experience…" {...field} />
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

        <Button
          type="submit"
          disabled={updateProfile.isPending || !form.formState.isDirty}
          className="gap-2"
        >
          {updateProfile.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {updateProfile.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
