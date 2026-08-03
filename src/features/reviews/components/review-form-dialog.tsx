"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RatingInput } from "@/components/shared/rating-input";
import { useAuth } from "@/providers/auth-provider";
import { useCreateReviewMutation } from "@/features/reviews/hooks";
import { reviewFormSchema, type ReviewFormValues } from "@/features/reviews/schema";

interface ReviewFormDialogProps {
  technicianId: string;
  technicianName: string;
}

export function ReviewFormDialog({ technicianId, technicianName }: ReviewFormDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const createReview = useCreateReviewMutation({
    onSuccess: () => {
      toast.success("Thanks for your review!");
      setOpen(false);
      form.reset({ rating: 0, comment: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't submit your review.");
    },
  });

  function onSubmit(values: ReviewFormValues) {
    if (!user) return;
    createReview.mutate({
      customerId: user.id,
      technicianId,
      rating: values.rating,
      comment: values.comment || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" className="gap-2">
          <Star className="size-4" />
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {technicianName}</DialogTitle>
          <DialogDescription>
            Share how the job went — this helps other customers choose the right pro.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RatingInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell others about your experience…"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createReview.isPending} className="gap-2">
                {createReview.isPending && <Loader2 className="size-4 animate-spin" />}
                {createReview.isPending ? "Submitting…" : "Submit review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
