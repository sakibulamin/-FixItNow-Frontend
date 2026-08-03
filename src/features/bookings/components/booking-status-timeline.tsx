import { Ban, Check, XCircle } from "lucide-react";
import { cn, humanizeEnum } from "@/lib/utils";
import type { BookingStatus } from "@/types/enums";

const HAPPY_PATH: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
];

interface BookingStatusTimelineProps {
  status: BookingStatus;
}

export function BookingStatusTimeline({ status }: BookingStatusTimelineProps) {
  if (status === "DECLINED" || status === "CANCELLED") {
    const isDeclined = status === "DECLINED";
    return (
      <div className="border-destructive/30 bg-destructive/5 flex items-center gap-3 rounded-lg border px-4 py-3">
        <div className="bg-destructive/15 flex size-8 shrink-0 items-center justify-center rounded-full">
          {isDeclined ? (
            <XCircle className="text-destructive size-4" />
          ) : (
            <Ban className="text-destructive size-4" />
          )}
        </div>
        <p className="text-destructive text-sm font-medium">
          This booking was {isDeclined ? "declined by the technician" : "cancelled"}.
        </p>
      </div>
    );
  }

  const currentIndex = HAPPY_PATH.indexOf(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {HAPPY_PATH.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === HAPPY_PATH.length - 1;

        return (
          <li key={step} className="flex flex-1 items-start sm:flex-col">
            <div className="flex items-center sm:w-full">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isComplete && "border-success bg-success text-success-foreground",
                  isCurrent && "border-primary text-primary bg-background",
                  !isComplete && !isCurrent && "border-border text-muted-foreground bg-background",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : i + 1}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 sm:mx-0 sm:mt-3.5 sm:h-0.5 sm:w-full",
                    "hidden sm:block",
                    isComplete ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-1.5 ml-2 text-xs font-medium sm:ml-0",
                isCurrent ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {humanizeEnum(step)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
