import { LoaderCircle } from "lucide-react"

export const DashboardPageLoader = () => {
  return (
    <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56 bg-white">
      <LoaderCircle
        size={32}
        className="animate-spin"
        strokeWidth={1.75}
      />
    </div>
  );
}
