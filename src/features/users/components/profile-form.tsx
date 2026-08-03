"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateUserMutation } from "@/features/users/hooks";
import { profileFormSchema, type ProfileFormValues } from "@/features/users/schema";
import type { User } from "@/types/user";

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      address: user.address ?? "",
    },
  });

  const updateUser = useUpdateUserMutation({
    onSuccess: (updatedUser) => {
      toast.success("Profile updated.");
      form.reset({
        name: updatedUser.name,
        phone: updatedUser.phone ?? "",
        address: updatedUser.address ?? "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't update your profile.");
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateUser.mutate({
      id: user.id,
      payload: {
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="01XXXXXXXXX" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your address"
                    autoComplete="street-address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={updateUser.isPending || !form.formState.isDirty}
          className="gap-2"
        >
          {updateUser.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {updateUser.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
