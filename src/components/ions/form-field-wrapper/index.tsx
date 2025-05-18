import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface FieldWrapperProps {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  message?: string;
  messageClassName?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper = ({ label, iconLeft, iconRight, message, messageClassName, children, className }: FieldWrapperProps) => {
  const { t } = useTranslation('form');

  return (
    <label className={cn("flex flex-col gap-2", className)}>
      {label && <span className="text-sm text-black font-medium">{label}</span>}

      <div className="relative">
        {iconLeft && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {iconLeft}
          </div>
        )}

        <div>
          {children}
        </div>

        {iconRight && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {iconRight}
          </div>
        )}
      </div>

      {message && <span className={cn("text-xs", messageClassName)}>{t(message)}</span>}
    </label>
  )
}