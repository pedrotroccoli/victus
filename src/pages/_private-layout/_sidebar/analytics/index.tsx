import { AnalyticsBox } from "@/features/analytics/components/atoms/analytics-box"
import { getHabitsAnalytics, HabitsAnalytics } from "@/features/habits/utils/analytics"
import { useMe } from "@/services/auth"
import { useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks"
import { DateFormat } from "@/services/habits/types"
import { Hash, Percent } from "@phosphor-icons/react"
import { eachDayOfInterval, endOfDay, format, subDays } from "date-fns"
import { useMemo } from "react"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis } from "recharts"


const chartConfig = {
  percentage: {
    label: "Performance: ",
    color: "#2563eb",
    icon: Percent
  }
} satisfies ChartConfig

const chartConfig2 = {
  total: {
    label: "Hábitos completados:",
    color: "#2563eb",
    icon: Hash
  }
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
          [format(current.finished_at, 'MM/dd')]: current
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

  const chart2Data = useMemo(() => {
    return analytics.map(item => ({
      ...item,
      missing: item.total - item.alreadyChecked,
      completed: item.alreadyChecked
    }));
  }, [analytics]);


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
      <ul className="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
        <li>
          <div className="bg-white border border-neutral-300 rounded-lg w-full relative">
            <div className="flexflex-col">
              <h3 className="text-lg font-medium font-[Recursive] m-2 ml-4">Sua performance</h3>
              <div className="w-full my-2 h-[1px] bg-neutral-300"></div>
              <div className="flex items-center justify-between p-2 px-4">
                <h4 className="text-sm font-medium font-[Recursive]">Média nos últimos 7 dias:</h4>
                <p className="text-sm font-medium text-black/75">{smallAnalytics.today.percentage}%</p>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="w-full max-w-full"  >
              <AreaChart accessibilityLayer data={analytics} width={200} margin={{ top: 20 }} >
                {/* <CartesianGrid vertical={false} /> */}

                <Area dataKey="percentage" fill="#8884d8" radius={4} >

                </Area>

                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />

                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} angle={0}
                  padding={{ left: 0, right: 0 }}
                />

                {/* <YAxis max={100} min={0} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} domain={[0, 100]}
                  width={0}
                /> */}
              </AreaChart>
            </ChartContainer>
          </div>

        </li>

        <li>
          <div className="bg-white border border-neutral-300 rounded-lg w-full relative">
            <div className="flexflex-col">
              <h3 className="text-lg font-medium font-[Recursive] m-2 ml-4">Hábitos completados</h3>
              <div className="w-full my-2 h-[1px] bg-neutral-300"></div>
              <div className="flex items-center justify-between p-2 px-4">
                <h4 className="text-sm font-medium font-[Recursive]">Média nos últimos 7 dias:</h4>
                <p className="text-sm font-medium text-black/75">{Math.floor(analytics.reduce((acc, item) => acc + item.alreadyChecked, 0) / analytics.length)} hábitos por dia</p>
              </div>
            </div>
            <ChartContainer config={chartConfig2} className="w-full max-w-full"  >
              <BarChart accessibilityLayer data={chart2Data} width={200} className="px-4" >
                <Bar dataKey="missing" fill="#e1615a" radius={4} stackId="a" />

                <Bar dataKey="completed" fill="#20cfad" radius={4} stackId="a" />


                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} angle={0}
                  padding={{ left: 0, right: 0 }}
                />

                {/* <YAxis max={100} min={0} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} domain={[0, 100]}
                  width={0}
                /> */}
              </BarChart>
            </ChartContainer>
          </div>

        </li>


      </ul>
    </div>
  )
}