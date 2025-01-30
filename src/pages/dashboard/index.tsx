import { addDays, eachDayOfInterval, format, isAfter, isBefore, subDays } from "date-fns";
import { Book, BookOpen, Box, BringToFront, LoaderCircle, PlusCircle, SendToBack } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet";

import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { useCheckHabit, useCreateHabit, useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks";

import { Header } from "@/components/organisms/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AnalyticsBox } from "@/features/analytics/components/atoms/analytics-box";
import { BoxesExplanation } from "@/features/habits/components/atoms/boxes-explanation";
import { CreateHabitModal, CreateHabitModalOnSaveProps } from "@/features/habits/components/templates/create-habit-modal";
import { HabitLines } from "@/features/habits/components/templates/habit-lines";
import { cn } from "@/lib/utils";
import { DateFormat } from "@/services/habits/types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Home = () => {
  const startRange = subDays(new Date(), 12);
  const endRange = addDays(new Date(), 12);

  const navigate = useNavigate();
  const { data: me, isLoading: isLoadingMe } = useMe();
  const { data: habits, isLoading: isLoadingHabits } = useGetHabits({
    start_date: format(startRange, 'yyyy-MM-dd') as DateFormat,
    end_date: format(endRange, 'yyyy-MM-dd') as DateFormat
  }, {
    enabled: !!me
  });
  const { data: habitsCheck, isLoading: isLoadingHabitsCheck } = useGetHabitsCheck({
    start_date: format(startRange, 'yyyy-MM-dd') as DateFormat,
    end_date: format(endRange, 'yyyy-MM-dd') as DateFormat,
  }, {
    enabled: !!me && habits && habits.length > 0

  });

  const generalLoading = useMemo(() => isLoadingMe || isLoadingHabits || isLoadingHabitsCheck, [isLoadingMe, isLoadingHabits, isLoadingHabitsCheck]);

  const [hideHabits, setHideHabits] = useState(false);
  const [hideExplanation, setHideExplanation] = useState(true);
  const [orderEnabled, setOrderEnabled] = useState(false);

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


  const { mutateAsync: checkHabit } = useCheckHabit();
  const { mutateAsync: createHabit } = useCreateHabit();

  const currentDay = useMemo(() => new Date(), []);

  const daysInMonth = eachDayOfInterval({ start: startRange, end: endRange });

  const [createHabitOpen, setCreateHabitOpen] = useState(false);

  const onCreateHabit = async (params: CreateHabitModalOnSaveProps) => {
    try {
      await createHabit({
        name: params.name,
        start_date: params.start_date,
        end_date: params.end_date,
        infinite: !!params.infinite,
        recurrence_details: {
          rule: params.rrule
        }
      });

      toast.success('Hábito criado com sucesso!');

      setCreateHabitOpen(false);
    } catch (error) {
      toast.error('Erro ao criar hábito!');
    }
  }

  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  }

  const handleCheckHabit = (habit: Habit, formattedDay: string) => {
    const habitCheck = getHabitCheck(habit, formattedDay);

    checkHabit({
      habit_id: habit._id,
      check_id: habitCheck?._id
    });
  }

  const handleSignOut = async () => {
    await signOut();

    navigate({
      to: '/',
    });
  }

  const getAnalyticsFromDate = useCallback((date: Date) => {
    const dayHabits = habits?.filter((item: Habit) => {
      if (isBefore(item.start_date, date)) return true;

      if (item.recurrence_type === 'infinite') return true;

      if (item?.end_date && isAfter(item.end_date, date)) return true;

      return false;
    });

    const dayFormatted = format(date, 'MM/dd/yyyy');

    const alreadyChecked = dayHabits?.filter(item => habitsCheckedHash?.[item._id]?.[dayFormatted]?.checked || false);

    return ({
      total: dayHabits?.length,
      alreadyChecked: alreadyChecked?.length,
      percentage: Number((((alreadyChecked?.length || 0) / (dayHabits?.length || 1)) * 100).toFixed(0))
    })
  }, [habits, habitsCheckedHash])

  const smallAnalytics = useMemo(() => {
    const yesterday = subDays(currentDay, 1);
    const yesterdayAnalytics = getAnalyticsFromDate(yesterday);

    const todayAnalytics = getAnalyticsFromDate(currentDay);

    return ({
      yesterday: yesterdayAnalytics,
      today: todayAnalytics,
      compare: todayAnalytics.percentage - yesterdayAnalytics.percentage,
    })
  }, [getAnalyticsFromDate, currentDay])

  if (isLoadingMe) {
    return (
      <main>
        <div className="h-screen flex items-center justify-center">
          <LoaderCircle size={32} className="animate-spin" strokeWidth={1.75} />
        </div>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>Victus Journal | Dashboard</title>
      </Helmet>

      <main className="max-w-screen-xl mx-auto border-x border-neutral-300 h-screen bg-[url('/dashboard-bg.png')]">
        <Header account={me} handleSignOut={handleSignOut} />

        <section className="max-w-screen-lg w-full mx-auto bg-sign">
          <div className="px-4 sm:px-8 pt-16">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <h1 className="font-[Recursive] text-xl font-semibold">Olá {String(me.name).split(' ')[0]}, aqui está seu Jornal!</h1>

              <Dialog open={createHabitOpen} onOpenChange={setCreateHabitOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full flex gap-4 bg-black rounded-md text-white sm:max-w-40" onClick={() => setCreateHabitOpen(true)}>
                    <PlusCircle size={16} />
                    Adicionar
                  </Button>
                </DialogTrigger>

                <CreateHabitModal onSave={onCreateHabit} />
              </Dialog>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="mt-8 bg-white w-full">

              <div className="w-full">
                {habits && habits.length === 0 && (
                  <div className="flex items-center justify-center h-full flex-col border-black border-2 rounded-md p-8 min-h-56">
                    <Box size={32} />

                    <p className="text-lg text-black/75 font-medium mt-4 mb-8">Nenhum hábito cadastrado</p>

                    <Button className="flex gap-4 bg-black rounded-md text-white" onClick={() => setCreateHabitOpen(true)}>
                      <PlusCircle size={16} />
                      Criar meu primeiro hábito
                    </Button>
                  </div>
                )}

                {generalLoading && (
                  <div className="flex items-center justify-center h-full flex-col border-black border-2 rounded-md p-8 min-h-56">
                    <LoaderCircle size={32} className="animate-spin" strokeWidth={1.75} />
                  </div>
                )}

                {habits && habits.length > 0 && !generalLoading && (
                  <div className="border-2 border-neutral-400 rounded-md">
                    <div className={
                      cn(
                        "flex items-center justify-between border-b border-black p-4 pr-8 relative",
                        hideExplanation && "border-b-0 p-0 pr-0"
                      )
                    }>
                      <div className="absolute top-0 right-0 border-l border-b border-black rounded-bl-md flex items-center divide-x divide-black">
                        <button className={
                          cn(
                            "h-5 w-5 flex items-center justify-center",
                            "hover:bg-black hover:text-white duration-200 transition-colors"
                          )
                        }
                          onClick={() => setOrderEnabled(!orderEnabled)}
                        >
                          {orderEnabled ? (
                            <BringToFront size={12} className="-translate-y-px translate-x-px" />
                          ) : (
                            <SendToBack size={14} className="-translate-y-px translate-x-px" />
                          )}
                        </button>

                        <button className={
                          cn(
                            "h-5 w-5 flex items-center justify-center",
                            "hover:bg-black hover:text-white duration-200 transition-colors"
                          )
                        }
                          onClick={() => setHideExplanation(!hideExplanation)}
                        >
                          {hideExplanation ? (
                            <Book size={14} className="-translate-y-px translate-x-px" />
                          ) : (
                            <BookOpen size={14} className="-translate-y-px translate-x-px" />
                          )}
                        </button>
                      </div>

                      {!hideExplanation && (
                        <BoxesExplanation />
                      )}
                    </div>

                    <div className="px-4 pt-4">
                      <h3 className="text-lg font-[Recursive] font-medium">Hábitos</h3>
                    </div>

                    <div className="p-4" >
                      <HabitLines
                        habits={habits}
                        orderEnabled={orderEnabled}
                        hideHabits={hideHabits}
                        setHideHabits={setHideHabits}
                        daysInMonth={daysInMonth}
                        getHabitCheck={getHabitCheck}
                        currentDay={currentDay}
                        onCheckHabit={handleCheckHabit}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}