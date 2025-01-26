import { addDays, eachDayOfInterval, format, subDays } from "date-fns";
import { Box, LoaderCircle, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";


import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { useCheckHabit, useCreateHabit, useGetHabits, useGetHabitsCheck } from "@/services/habits/hooks";


import { LogoWithText } from "@/assets/logo-with-text";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HabitLineCheckboxes } from "@/features/habits/components/organism/habit-line-checkboxes";
import { CreateHabitForm, CreateHabitModal } from "@/features/habits/components/templates/create-habit-modal";
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

  const [hideHabits, setHideHabits] = useState(false);

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

      <main className="max-w-screen-xl mx-auto border-x border-neutral-300 h-screen bg-[url('/dashboard-bg.png')]">
        <header className="w-full border-neutral-300 border-b py-4 px-8 bg-white">
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

        <div className="max-w-screen-lg mx-auto px-6 pt-16 bg-sign">
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

          <div className="mt-8 overflow-auto bg-white">
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
                    <HabitLineCheckboxes
                      key={item._id}
                      item={item}
                      hideHabits={hideHabits}
                      setHideHabits={setHideHabits}
                      daysInMonth={daysInMonth}
                      getHabitCheck={getHabitCheck}
                      currentDay={currentDay}
                      onCheckHabit={handleCheckHabit}
                      isFirst={habitIndex === 0}
                      isLast={habitIndex === habits.length - 1}
                    />
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