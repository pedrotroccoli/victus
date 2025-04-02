
interface AnalyticsBoxProps {
  title: string;
  value: React.ReactNode;
  loading?: boolean;
}

export const AnalyticsBox = ({ title, value, loading }: AnalyticsBoxProps) => {
  return (
    <div className=" bg-white border border-black p-3 rounded-md sm:p-4">
      <h6 className="font-[Recursive] text-base font-medium sm:text-lg text-black">{title}</h6>
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