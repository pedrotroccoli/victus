"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ComboboxProps {
  options: { label: string; value: string | null | undefined }[];
  value: string | null | undefined;
  onChange: (value: string | null | undefined) => void;
  placeholder: string;
  commandPlaceholder: string;
  commandEmpty: string;
  disabled?: boolean;
}

export function Combobox({ options, value, onChange, placeholder, commandEmpty, commandPlaceholder, disabled }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", disabled && "opacity-50 cursor-not-allowed")}
          disabled={disabled}
        >
          {(value !== undefined && value !== null)
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={commandPlaceholder} />
          <CommandList>
            <CommandEmpty>{commandEmpty}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value as string}
                  onSelect={() => {
                      onChange(option.value)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
