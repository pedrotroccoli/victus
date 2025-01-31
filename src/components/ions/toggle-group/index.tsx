import { ToggleGroupItem, ToggleGroup as UiToggleGroup } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ToggleGroupMultipleProps } from "@radix-ui/react-toggle-group";

export interface ToggleGroupProps extends Omit<ToggleGroupMultipleProps, 'type'> {
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
  label?: string;
  message?: string;
  messageClassName?: string;
}

export const ToggleGroup = ({ options, label, message, messageClassName, ...props }: ToggleGroupProps) => {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-black font-medium">{label}</span>}

      <UiToggleGroup
        variant="outline"
        type="multiple"
        {...props}
      >
        {options.map((day) => (
          <ToggleGroupItem className='w-4 h-8 p-0 border text-xs data-[state=on]:bg-black data-[state=on]:text-white' key={day.value} value={day.value}>{day.label}</ToggleGroupItem>
        ))}
      </UiToggleGroup>

      {message && <span className={cn("text-xs", messageClassName)}>{message}</span>}
    </label>
  )
}