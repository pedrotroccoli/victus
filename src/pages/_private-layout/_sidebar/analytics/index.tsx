import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AnalyticsBox } from "@/features/analytics/components/atoms/analytics-box"
import { getHabitsAnalytics, HabitsAnalytics } from "@/features/habits/utils/analytics"
import { useMe } from "@/services/auth"
import { useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks"
import { DateFormat } from "@/services/habits/types"
import { Percent } from "@phosphor-icons/react"
import { eachDayOfInterval, endOfDay, format, subDays } from "date-fns"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"


const chartConfig = {
  percentage: {
    label: "Performance: ",
    color: "#2563eb",
    icon: Percent
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const currentDay = new Date();

export const Analytics = () => {
  const startRange = subDays(new Date(), 7);
  const endRange = endOfDay(new Date());

  const { data: me } = useMe();
  const { data: habits } = useGetHabits({
    start_date: format(startRange, 'yyyy-MM-dd') as DateFormat,
    end_date: format(endRange, 'yyyy-MM-dd') as DateFormat
  }, {
    enabled: !!me
  });
  const { data: habitsCheck } = useGetHabitsCheck({
    start_date: format(startRange, 'yyyy-MM-dd') as DateFormat,
    end_date: format(endRange, 'yyyy-MM-dd') as DateFormat,
  }, {
    enabled: !!me && habits && habits.length > 0
  });

  const generalLoading = useMemo(() => {
    return !habits || !habitsCheck;
  }, [habits, habitsCheck])

  const habitsCheckedHash = useMemo(() => {
    if (!habitsCheck) return {};

    return habitsCheck.reduce((previous: Record<string, Record<string, HabitCheck>>, current: HabitCheck) => {
      if (!current.finished_at) return previous;

      return ({
        ...previous,
        [current.habit_id]: {
          ...(previous[current.habit_id] || {}),
          [format(current.finished_at, 'MM/dd/yyyy')]: current
        }
      })
    }, {});
  }, [habitsCheck])

  const { getAnalyticsFromDate } = useMemo(() => getHabitsAnalytics(habits as Habit[], habitsCheckedHash), [habits, habitsCheckedHash]);

  const analytics = useMemo((): HabitsAnalytics[] => {
    const sevenDaysAgo = subDays(new Date(), 7);

    return eachDayOfInterval({
      start: sevenDaysAgo,
      end: currentDay
    }).map(day => getAnalyticsFromDate(day));
  }, [getAnalyticsFromDate]);

  const smallAnalytics = useMemo(() => {
    const yesterday = subDays(currentDay, 1);
    const yesterdayAnalytics = getAnalyticsFromDate(yesterday);

    const todayAnalytics = getAnalyticsFromDate(currentDay);

    return ({
      yesterday: yesterdayAnalytics,
      today: todayAnalytics,
      compare: todayAnalytics.percentage - yesterdayAnalytics.percentage,
    })
  }, [getAnalyticsFromDate])


  return (
    <div className="flex flex-col items-center justify-center h-full pt-4 w-full gap-8">
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 sm:mt-8 lg:grid-cols-3 w-full">
        <AnalyticsBox
          title="Hoje você completou"
          value={`${smallAnalytics.today.alreadyChecked} de ${smallAnalytics.today.total} hábitos`}
          loading={generalLoading}
        />

        <AnalyticsBox
          title="Hoje você está em"
          value={`${smallAnalytics.today.percentage}% de aproveitamento`}
          loading={generalLoading}
        />

        <AnalyticsBox
          title="Comparando com ontem"
          value={`${smallAnalytics.compare > 0 ? 'Aumentou' : 'Diminuiu'} em ${smallAnalytics.compare}%`}
          loading={generalLoading}
        />
      </div>
      <ul className="grid grid-cols-1 gap-4 w-full">
        <li>
          <div className="bg-white border border-black rounded-lg w-full relative">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-bold font-[Recursive]">Sua performance:</h3>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full max-w-full p-2">
              <BarChart accessibilityLayer data={analytics}>
                <CartesianGrid vertical={true} />

                <Bar dataKey="percentage" fill="var(--color-percentage)" radius={4} />

                <ChartTooltip content={<ChartTooltipContent />} />

                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={16} />

                <YAxis max={100} min={0} tickLine={false} axisLine={false} tickMargin={16} tickFormatter={(value) => `${value}%`} />

                {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
              </BarChart>
            </ChartContainer>
          </div>

        </li>

      </ul>
    </div>
  )
}