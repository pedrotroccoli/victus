import { addDays, eachDayOfInterval, endOfDay, format, isAfter, isBefore, isEqual, isSameDay, startOfDay, subDays } from "date-fns";
import { Box, CircleArrowDown, LoaderCircle, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";


import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { useCheckHabit, useCreateHabit, useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks";


import { LogoWithText } from "@/assets/logo-with-text";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateHabitForm, CreateHabitModal } from "@/features/habits/templates/create-habit-modal";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Home = () => {
  const navigate = useNavigate();
  const { data: me, isLoading: isLoadingMe } = useMe();
  const { data: habits } = useGetHabits({
    enabled: !!me
  });
  const { data: habitsCheck } = useGetHabitsCheck({
    enabled: !!me
  });

  const [isHovering, setIsHovering] = useState<string | null>(null);


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
  const { mutateAsync: createHabit } = useCreateHabit();

  const startRange = subDays(new Date(), 13);
  const endRange = addDays(new Date(), 13);
  const currentDay = new Date();

  const daysInMonth = eachDayOfInterval({ start: startRange, end: endRange });

  const [createHabitOpen, setCreateHabitOpen] = useState(false);

  const onCreateHabit = async (params: CreateHabitForm) => {
    try {
      await createHabit({
        name: params.name,
        start_date: params.start_date,
        end_date: params.end_date,
        infinite: !!params.infinite
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

      <main className="max-w-screen-xl mx-auto border-x border-neutral-300 h-screen">
        <header className="w-full border-neutral-300 border-b py-4 px-8">
          <div className="flex items-center justify-between max-w-screen-lg mx-auto px-6">
            <div className="flex items-center">
              <LogoWithText className="max-w-20" />
            </div>

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
          <div className="flex items-end justify-between">
            <h1 className="font-sans text-xl font-medium">Olá {String(me.name).split(' ')[0]}, aqui está seu jornal!</h1>

            <Dialog open={createHabitOpen} onOpenChange={setCreateHabitOpen}>
              <DialogTrigger>
                <Button className="flex gap-4 bg-black rounded-md text-white" onClick={() => setCreateHabitOpen(true)}>
                  <PlusCircle size={16} />
                  Adicionar
                </Button>
              </DialogTrigger>

              <CreateHabitModal onSave={onCreateHabit} />
            </Dialog>
          </div>

          <div className="mt-8 overflow-auto">
            <div className="w-full">
              {habits && habits.length === 0 && (
                <div className="flex items-center justify-center h-full flex-col border-black border-2 rounded-md p-8">
                  <Box size={32} />

                  <p className="text-lg text-black/75 font-medium mt-4 mb-8">Nenhum hábito cadastrado</p>

                  <Button className="flex gap-4 bg-black rounded-md text-white" onClick={() => setCreateHabitOpen(true)}>
                    <PlusCircle size={16} />
                    Criar meu primeiro hábito
                  </Button>

                </div>
              )}

              {habits && habits.length > 0 && (

                <div className="border-2 border-neutral-400 rounded-md p-4">

                  {habits && habits?.map((item: Habit, habitIndex: number) => (
                    <div className={
                      cn(
                        "flex justify-between items-center",
                        habitIndex === 0 && "items-end",
                      )
                    } key={item._id}>
                      <div className="flex items-center gap-4 w-16 min-w-12  flex-1 h-auto">
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <p className={
                                cn(
                                  "text-xs font-bold whitespace-nowrap truncate mr-2 border-2 border-transparent p-1 rounded-md",
                                  habitIndex === 0 && "pb-1",
                                  isHovering === item._id && "border-black"
                                )
                              }>{item.name}</p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      </div>

                      <div className="flex">
                        {daysInMonth.map((monthDay, index) => {
                          const realDay = index + 1;
                          const formattedDay = format(monthDay, 'MM/dd/yyyy');
                          const isChecked = !!getHabitCheck(item, formattedDay)?.checked;
                          const isAPastDay = isBefore(monthDay, subDays(new Date(), 1));

                          const habitStartDate = startOfDay(item.start_date);
                          const habitEndDate = endOfDay(item.end_date);
                          const sameDay = isSameDay(monthDay, habitStartDate);

                          const isInfinite = item.recurrence_type === 'infinite';

                          const today = format(currentDay, 'dd/MM/yyyy') === format(monthDay, 'dd/MM/yyyy');

                          const isInTheHabitRange = sameDay || (isAfter(monthDay, habitStartDate) && (isInfinite ? true : isBefore(monthDay, habitEndDate)));
                          const day = format(monthDay, 'dd');

                          return (
                            <div className="flex flex-col items-center justify-end">
                              <div className="hover:">
                                {habitIndex === 0 && (
                                  <>
                                    {isEqual(monthDay, startOfDay(new Date())) && (
                                      <CircleArrowDown size={14} className="mb-4" />
                                    )}
                                    <TooltipProvider>
                                      <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                          <p className={cn(
                                            "text-xs mb-2 font-medium text-black rounded-sm",
                                          )}>{day}</p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{format(monthDay, 'dd/MM/yyyy')}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </div>

                              <button
                                key={`${item._id} - ${realDay}`}
                                onMouseEnter={() => setIsHovering(item._id)}
                                onMouseLeave={() => setIsHovering(null)}
                                className={
                                  cn(
                                    "w-7 h-7 flex items-center justify-center border border-neutral-300",
                                    habitIndex === 0 && today && "border-t-neutral-500",
                                    habitIndex === habits.length - 1 && today && "border-b-neutral-500",
                                    "data-[is-current-day=true]:border-x-neutral-500",
                                    "enabled:hover:border-black enabled:hover:border-2 ",
                                    "disabled:cursor-not-allowed",
                                    "data-[is-checked=true]:bg-checked-box-01",
                                    "data-[is-out-of-range=true]:bg-neutral-200",
                                    // habitIndex % 2 === 0 && "rotate-90"
                                  )}
                                data-is-current-day={today}
                                data-is-checked={isChecked}
                                data-is-out-of-range={!isInTheHabitRange}
                                data-is-today={today}
                                disabled={!isInTheHabitRange || !today}
                                onClick={handleCheckHabit(item, formattedDay)}
                              >
                                {!isChecked && isAPastDay && isInTheHabitRange && (
                                  <div className="w-1 h-1 border border-black rounded-full">
                                  </div>
                                )}

                                {process.env.NODE_ENV === 'development' && false && (
                                  <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                      <TooltipTrigger>
                                        <div className="bg-red-500 w-1 h-1 rounded-full"></div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Range: {String(isInTheHabitRange)}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}


                              </button>
                            </div>
                          )

                        })}
                      </div>
                    </div>
                  ))}
                </div>

              )}
            </div>

          </div>
        </div>
      </main>
    </>
  )
}