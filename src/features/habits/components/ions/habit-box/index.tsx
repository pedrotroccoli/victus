import { cn } from "@/lib/utils";

type HabitBoxType = 'none' | 'empty' | 'checked' | 'out-of-range';

interface HabitBoxProps extends React.HTMLAttributes<HTMLButtonElement> {
  type: HabitBoxType;
  disabled?: boolean;
  checkedPattern?: '01' | '02';
}

export function HabitBox({ type = 'none', className, children, checkedPattern = '01', ...rest }: HabitBoxProps) {
  return (
    <button
      className={
        cn(
          "w-7 h-7 flex items-center justify-center border border-neutral-300",
          "enabled:hover:border-black enabled:hover:border-2 ",
          "disabled:cursor-not-allowed",
          checkedPattern === '01' && `data-[is-checked=true]:bg-checked-box-01`,
          checkedPattern === '02' && `data-[is-checked=true]:bg-checked-box-02`,
          "data-[is-out-of-range=true]:bg-neutral-200",
          className
        )}
      data-is-checked={type === 'checked'}
      data-is-out-of-range={type === 'out-of-range'}
      {...rest}
    >
      {type === 'empty' && (
        <div className="w-1 h-1 border border-black rounded-full">
        </div>
      )}
      {children}
    </button>
  )
}