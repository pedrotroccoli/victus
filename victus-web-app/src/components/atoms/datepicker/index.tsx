"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


export type DatePickerProps = {
  disabledMessage?: string;
  onSelect?: (date: Date | undefined) => void;
} & Omit<CalendarProps, 'onSelect'>;

export function DatePicker({ className, selected, disabledMessage, onSelect, ...props }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const date = selected;

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect?.(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal hover:border-black hover:bg-neutral-100",
            !date && "text-muted-foreground",
            disabledMessage && "cursor-not-allowed",
            className
          )}
          disabled={!!disabledMessage}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {disabledMessage && (
            <span>{disabledMessage}</span>
          )}

          {!disabledMessage && (
            <>

              {/* @ts-expect-error blabla */}
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <Calendar
          mode="single"
          locale={ptBR}
          // @ts-expect-error Calendar types conflict with single mode
          onSelect={handleSelect}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
