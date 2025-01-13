import { cn } from "@/lib/utils"

type PasswordStrengthBarsProps = {
  passwordStrength: number
} & React.HTMLAttributes<HTMLDivElement>

export function PasswordStrengthBars({ passwordStrength, className }: PasswordStrengthBarsProps) {
  return (
    <div className={className}>
      <div className='grid grid-cols-5 gap-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={
            cn('w-full h-1 bg-black rounded-full',
              index < passwordStrength ? 'bg-black' : 'bg-black/20'
            )
          }></div>
        ))}
      </div>
    </div>
  )
}
