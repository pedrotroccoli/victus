import { cn } from "@/lib/utils";

interface GridProps {
  children?: React.ReactNode
  className?: string
  type?: 'normal' | 'small'
  style?: 'white' | 'black';
}

export const Grid = ({ children, className, type, style = 'white' }: GridProps) => {
  const gridClass = type === 'small' ? 'grid-container-small' : 'grid-container'
  const borderColor = style === 'white' ? 'border-neutral-300' : 'border-neutral-700'

  return (
    <div className="w-full h-full z-[3] relative">
      <div className="absolute top-0 left-0 w-full h-full z-[1]">
        <div className={cn("relative w-full h-full grid-container")}>
          <div className={cn("w-px h-full border-r border-dashed absolute top-0 left-2 md:left-4", borderColor)}></div>
          <div className={cn("w-px h-full border-r border-dashed absolute top-0 right-2 md:right-4", borderColor)}></div>
        </div>
      </div>
      <div className={cn("z-[4]", gridClass, className)}>
        {children}
      </div>
    </div>
  )
}