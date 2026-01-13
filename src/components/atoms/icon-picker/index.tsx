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

export interface IconPickerProps {
  value?: CategoryIconName;
  onChange?: (value: CategoryIconName) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const IconPicker = ({
  value,
  onChange,
  placeholder = 'Select icon',
  disabled = false,
  className,
}: IconPickerProps) => {
  const [open, setOpen] = useState(false);

  const SelectedIcon = value ? categoryIcons[value] : null;

  const handleSelect = (iconName: CategoryIconName) => {
    onChange?.(iconName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          <span className="flex items-center gap-2">
            {SelectedIcon ? (
              <>
                <SelectedIcon size={18} />
                <span className="text-muted-foreground">{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
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
                    const isSelected = value === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelect(iconName)}
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
  );
};

export interface IconDisplayProps {
  name?: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export const IconDisplay = ({
  name,
  size = 18,
  className,
  fallback = <Circle size={18} />,
}: IconDisplayProps) => {
  if (!name) return <>{fallback}</>;

  const Icon = categoryIcons[name as CategoryIconName];
  if (!Icon) return <>{fallback}</>;

  return <Icon size={size} className={className} />;
};
