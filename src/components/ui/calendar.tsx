import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 rounded-lg shadow-md bg-card w-full", className)}
      classNames={{
        /* --- Estructura general --- */
        months: "flex flex-col sm:flex-row gap-6 justify-center w-full",
        month: "space-y-6 w-full",
        caption: "flex justify-center items-center relative py-3",
        caption_label: "text-xl font-semibold tracking-tight",
        nav: "flex items-center gap-2 absolute right-2",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
        ),
        nav_button_previous: "",
        nav_button_next: "",

        /* --- Cabecera de días --- */
        head_row: "grid grid-cols-7 text-center text-base font-semibold text-muted-foreground w-full",
        head_cell: "py-3 uppercase tracking-wide w-full",

        /* --- Celdas --- */
        row: "grid grid-cols-7 gap-3 w-full",
        cell: "relative w-full",

        /* --- Días individuales MÁS GRANDES --- */
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-16 w-16 text-lg font-medium rounded-lg flex items-center justify-center transition-all hover:scale-105"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground font-semibold shadow-md transform scale-105 hover:bg-primary/90",
        day_today:
          "border-2 border-primary font-bold text-primary",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle:
          "bg-accent/60 text-accent-foreground font-semibold rounded-none",
        day_hidden: "invisible",

        /* --- Días personalizados --- */
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-6 w-6" />,
        IconRight: () => <ChevronRight className="h-6 w-6" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };