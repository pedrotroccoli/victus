import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GridWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const GridWrapper = ({ children, ...props }: GridWrapperProps) => {
  return <div {...props} className={cn("max-w-screen-lg mx-auto bg-sign h-full px-8", props.className)}>{children}</div>
}