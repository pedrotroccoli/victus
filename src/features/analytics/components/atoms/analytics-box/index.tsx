
interface AnalyticsBoxProps {
  title: string;
  value: React.ReactNode;
  loading?: boolean;
}

export const AnalyticsBox = ({ title, value, loading }: AnalyticsBoxProps) => {
  return (
    <div className=" bg-white border-2 border-neutral-400 p-4 rounded-md">
      <h6 className="font-[Recursive] text-lg font-medium">{title}</h6>
      <div className="mt-2">
        {loading ? (
          <div className="w-3/4 h-4 bg-stone-200 rounded-md animate-pulse border border-stone-400"></div>
        ) : (
          <p className="text-sm text-black/70">{value}</p>
        )}
      </div>
    </div>
  )
}