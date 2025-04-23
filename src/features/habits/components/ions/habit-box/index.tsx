import { cn } from "@/lib/utils";

export type HabitBoxType = 'none' | 'empty' | 'checked' | 'blocked' | 'blocked-dark';

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
          "w-10 h-10 md:h-7 md:w-7 flex items-center justify-center border border-neutral-300 bg-white",
          "enabled:hover:border-black enabled:hover:border-2 ",
          "disabled:cursor-not-allowed",
          checkedPattern === '01' && `data-[is-checked=true]:bg-checked-box-01`,
          checkedPattern === '02' && `data-[is-checked=true]:bg-checked-box-02`,
          "data-[is-blocked=true]:bg-neutral-200",
          "data-[is-blocked-dark=true]:bg-neutral-300 data-[is-blocked-dark=true]:border-neutral-300",
          "enabled:data-[is-blocked-dark=true]:hover:border-neutral-300 enabled:data-[is-blocked-dark=true]:hover:border-px",
          "enabled:data-[is-blocked-dark=true]:hover:cursor-not-allowed",

          className
        )}
      data-is-checked={type === 'checked'}
      data-is-blocked={type === 'blocked'}
      data-is-blocked-dark={type === 'blocked-dark'}
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