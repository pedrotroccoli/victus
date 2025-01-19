"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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

} & CalendarProps;

export function DatePicker({ className, selected, disabledMessage, ...props }: DatePickerProps) {
  const date = selected;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
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
              {date ? format(date, "PPP") : <span>Escolha uma data</span>}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <Calendar
          mode="single"
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
