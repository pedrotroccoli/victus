import { cn } from "@/lib/utils";

interface GridProps {
  children?: React.ReactNode
  className?: string
  style?: 'white' | 'black';
}

export const Grid = ({ children, className, style = 'white' }: GridProps) => {
  const borderColor = style === 'white' ? 'border-neutral-300' : 'border-neutral-700'

  return (
    <div className="w-full h-full z-[3] relative">
      <div className="absolute top-0 left-0 w-full h-full z-[1]">
        <div className="relative w-full h-full max-w-6xl mx-auto px-4 md:px-6">
          <div className={cn("w-px h-full border-r border-dashed absolute top-0 left-0", borderColor)}></div>
          <div className={cn("w-px h-full border-r border-dashed absolute top-0 right-0", borderColor)}></div>
        </div>
      </div>
      <div className={cn("z-[4] relative max-w-6xl mx-auto px-4 md:px-6", className)}>
        {children}
      </div>
    </div>
  )
}