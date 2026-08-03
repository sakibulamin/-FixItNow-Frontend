"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useUpdateTechnicianProfileMutation } from "@/features/technicians/hooks";
import { formatDate } from "@/lib/utils";
import type { AvailabilitySlot, TechnicianProfile } from "@/types/technician";

export function AvailabilityScheduler({ technician }: { technician: TechnicianProfile }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(technician.availability ?? []);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const updateProfile = useUpdateTechnicianProfileMutation({
    onSuccess: () => {
      toast.success("Availability updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't update your availability.");
    },
  });

  function addSlot() {
    if (!date) {
      toast.error("Pick a date first.");
      return;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be before end time.");
      return;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    const next = [...slots, { date: dateStr, startTime, endTime }].sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date),
    );
    setSlots(next);
  }

  function removeSlot(index: number) {
    setSlots(slots.filter((_, i) => i !== index));
  }

  function handleSave() {
    updateProfile.mutate({ id: technician.id, payload: { availability: slots } });
  }

  const scheduledDates = slots.map((s) => new Date(`${s.date}T00:00:00`));

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="w-fit p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
          modifiers={{ scheduled: scheduledDates }}
          modifiersClassNames={{ scheduled: "font-semibold underline" }}
        />
        <div className="flex flex-wrap items-center gap-2 border-t px-3 pt-3">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-[110px]"
            aria-label="Start time"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-[110px]"
            aria-label="End time"
          />
          <Button size="sm" onClick={addSlot} className="ml-auto gap-1.5">
            <Plus className="size-3.5" />
            Add slot
          </Button>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-sm font-semibold">
            {slots.length} scheduled {slots.length === 1 ? "slot" : "slots"}
          </p>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="gap-2"
          >
            {updateProfile.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Save availability
          </Button>
        </div>

        {slots.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No availability set"
            description="Pick a date and time range on the left, then add it here."
          />
        ) : (
          <div className="space-y-2">
            {slots.map((slot, i) => (
              <Card
                key={`${slot.date}-${slot.startTime}-${i}`}
                className="border-l-accent flex flex-row items-center justify-between border-l-4 p-3"
              >
                <CardContent className="p-0 text-sm">
                  <span className="font-medium">{formatDate(slot.date)}</span>
                  <span className="text-muted-foreground ml-2">
                    {slot.startTime} – {slot.endTime}
                  </span>
                </CardContent>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSlot(i)}
                  aria-label="Remove slot"
                >
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
