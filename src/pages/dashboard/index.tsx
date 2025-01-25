import { eachDayOfInterval, endOfMonth, format, getDate, isBefore, isEqual, startOfDay, startOfMonth, subDays } from "date-fns";
import { Box, CircleArrowDown, LoaderCircle, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";


import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { useCheckHabit, useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateHabitModal } from "@/features/habits/templates/create-habit-modal";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export const Home = () => {
  const navigate = useNavigate();
  const { data: me, isLoading: isLoadingMe } = useMe();
  const { data: habits } = useGetHabits({
    enabled: !!me
  });
  const { data: habitsCheck } = useGetHabitsCheck({
    enabled: !!me
  });


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

  const formattedShortname = useMemo(() => {
    if (!me) return 'X';

    const divided = me.name.split(' ').slice(0, 2).map((item: string) => String(item[0]).toUpperCase()).join('');

    return divided;
  }, [me])

  const { mutateAsync: checkHabit } = useCheckHabit();

  const firstDayOfMonth = startOfMonth(new Date());
  const lastDayOfMonth = endOfMonth(new Date());

  const currentDay = getDate(new Date());
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const [createHabitOpen, setCreateHabitOpen] = useState(false);


  // const handleSubmit = async (params: any) => {
  //   const { data } = await createHabit({
  //     name: params.name,
  //     start_date: params.start_date,
  //     end_date: params.end_date,
  //     infinite: params.infinite
  //   });

  //   console.log(data);

  //   setCreateHabitOpen(false);
  // }

  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  }

  const handleCheckHabit = (habit: Habit, formattedDay: string) => () => {
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

      <main className="max-w-screen-xl mx-auto border-x h-screen">
        <header className="border-b py-4 px-8">
          <div className="flex items-center justify-between">
            <div />

            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer border hover:border-black duration-200 transition-colors">
                    <AvatarImage src={undefined} />
                    <AvatarFallback>
                      {formattedShortname}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild className="h-auto">
                    <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer" onClick={handleSignOut}>
                      Sair
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="max-w-screen-lg mx-auto px-6 pt-16 ">
          <div className="flex items-center justify-between">
            <h1 className="font-sans text-xl font-medium">Olá {String(me.name).split(' ')[0]}, aqui está seu jornal!</h1>

            <Dialog open={createHabitOpen} onOpenChange={setCreateHabitOpen}>
              <DialogTrigger>
                <Button className="flex gap-4 bg-black rounded-md text-white" onClick={() => setCreateHabitOpen(true)}>
                  <PlusCircle size={16} />
                  Adicionar
                </Button>
              </DialogTrigger>

              <CreateHabitModal />
            </Dialog>
          </div>

          <div className="mt-8 overflow-auto min-h-20">
            <div className="w-full ">
              {habits && habits.length === 0 && (
                <div className="flex items-center justify-center h-full flex-col gap-4 border-black border-2 rounded-md p-8">
                  <Box size={32} />

                  <p className="text-sm text-black/75 font-medium">Nenhum hábito cadastrado</p>

                  <Button className="flex gap-4 bg-black rounded-md text-white" onClick={() => setCreateHabitOpen(true)}>
                    <PlusCircle size={16} />
                    Criar meu primeiro hábito
                  </Button>

                </div>
              )}
              {habits && habits?.map((item: Habit, habitIndex: number) => (
                <div className="flex items-end" key={item._id}>
                  <div>

                    <div className="flex items-center gap-4 w-16 min-w-24">
                      <p className="text-xs font-bold whitespace-nowrap mb-2">{item.name}</p>
                    </div>
                  </div>

                  <div className="flex">
                    {daysInMonth.map((monthDay, index) => {
                      const realDay = index + 1;
                      const formattedDay = format(monthDay, 'MM/dd/yyyy');
                      const isChecked = !!getHabitCheck(item, formattedDay)?.checked;
                      const isAPastDay = isBefore(monthDay, subDays(new Date(), 1));
                      const day = format(monthDay, 'dd');

                      return (
                        <div className="flex flex-col items-center justify-end">
                          <div>
                            {habitIndex === 0 && (
                              <>
                                {isEqual(monthDay, startOfDay(new Date())) && (
                                  <CircleArrowDown size={14} className="mb-4" />
                                )}
                                <p className="text-xs mb-2">{day}</p>
                              </>
                            )}
                          </div>

                          <button
                            key={`${item._id} - ${realDay}`}
                            className={
                              cn(
                                "w-7 h-7 flex items-center justify-center border border-neutral-300 disabled:border-neutral-300/30",
                                "disabled:cursor-not-allowed enabled:hover:border-black data-[is-current-day=true]:border-neutral-400 data-[is-checked=true]:bg-red-500",
                                "data-[is-checked=true]:bg-checked-box-01"
                              )}
                            data-is-current-day={realDay === currentDay}
                            data-is-checked={isChecked}
                            disabled={realDay > currentDay || realDay < currentDay}
                            onClick={handleCheckHabit(item, formattedDay)}
                          >
                            {!isChecked && isAPastDay && (
                              <div className="w-1 h-1 border border-black rounded-full">

                              </div>
                            )}
                          </button>
                        </div>
                      )

                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}