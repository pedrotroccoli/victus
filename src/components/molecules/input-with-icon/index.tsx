import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  categoryIcons,
  iconCategories,
  iconCategoryLabels,
  type CategoryIconName,
} from '@/lib/icons/category-icons';
import { Circle } from 'lucide-react';

export interface InputWithIconProps {
  value?: string;
  onChange?: (value: string) => void;
  icon?: CategoryIconName;
  onIconChange?: (icon: CategoryIconName) => void;
  placeholder?: string;
  label?: string;
  message?: string;
  messageClassName?: string;
  disabled?: boolean;
  className?: string;
}

export const InputWithIcon = ({
  value,
  onChange,
  icon,
  onIconChange,
  placeholder = 'Enter text...',
  label,
  message,
  messageClassName,
  disabled = false,
  className,
}: InputWithIconProps) => {
  const [open, setOpen] = useState(false);

  const SelectedIcon = icon ? categoryIcons[icon] : Circle;

  const handleIconSelect = (iconName: CategoryIconName) => {
    onIconChange?.(iconName);
    setOpen(false);
  };

  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-black font-medium">{label}</span>}

      <div
        className={cn(
          'flex h-10 w-full items-center rounded-md border border-input bg-background text-sm font-body',
          'hover:ring-1 hover:ring-black focus-within:border-black focus-within:bg-focus-background',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <button
              type="button"
              className={cn(
                'flex h-full items-center justify-center px-3 border-r border-input hover:bg-neutral-100 transition-colors rounded-l-md',
                icon ? 'text-foreground' : 'text-muted-foreground'
              )}
              title="Select icon"
            >
              <SelectedIcon size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <ScrollArea className="h-80">
              <div className="p-3">
                {Object.entries(iconCategories).map(([category, icons]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {iconCategoryLabels[category]}
                    </h4>
                    <div className="grid grid-cols-8 gap-1">
                      {icons.map((iconName) => {
                        const Icon = categoryIcons[iconName];
                        const isSelected = icon === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => handleIconSelect(iconName)}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent',
                              isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90'
                            )}
                            title={iconName}
                          >
                            <Icon size={18} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-full px-3 py-2 text-sm font-body bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      {message && <span className={cn("text-xs", messageClassName)}>{message}</span>}
    </label>
  );
};
