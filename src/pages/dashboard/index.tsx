import { eachDayOfInterval, endOfMonth, formatDate, getDate, getYear, isAfter, isBefore, startOfMonth, sub } from "date-fns";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";


import { TextField } from "@/components/molecules/form";
import { CheckboxField } from "@/components/molecules/form/CheckboxField";
import { DatePickerField } from "@/components/molecules/form/DatePickerField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMe } from "@/services/auth";
import { getToken } from "@/services/auth/services";
import { useCreateHabit, useGetHabits } from "@/services/habits/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface Habit {
  id: string;
  name: string;
  createdAt: string;
  startDate: string;
  endDate: string;
}

interface HabitItem {
  habit: Habit;
  dates: Record<string, Habit | null>;
}

const createHabitValidation = z.object({
  name: z.string().min(3),
  start_date: z.date(),
  end_date: z.date(),
  infinite: z.boolean().optional(),
})

export const Home = () => {
  const { data: me, isLoading: isLoadingMe } = useMe();
  const { data: habits, isLoading: isLoadingHabits } = useGetHabits({
    enabled: !!me
  });

  // console.log(habits);


  const firstDayOfMonth = startOfMonth(new Date());
  const lastDayOfMonth = endOfMonth(new Date());

  const currentYear = getYear(new Date());
  const currentDay = getDate(new Date());
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const { mutateAsync: createHabit } = useCreateHabit();

  const form = useForm({
    resolver: zodResolver(createHabitValidation)
  });
  const endDate = form.watch("end_date");

  const [habitItens, setHabitItens] = useState<HabitItem[]>([]);
  const [token, setToken] = useState<string>("");

  const [createHabitOpen, setCreateHabitOpen] = useState(false);

  const getHabits = useCallback(async () => {
    try {
      const token = await getToken();

      console.log(token);

      setToken(token);

      const data = [];

      const datesInsideRange = data.filter(item => isAfter(item.start_date, firstDayOfMonth));

      const habitsWithDates = datesInsideRange.map(habit => ({
        habit,
        dates: daysInMonth.reduce((previous, current) => {
          const currentDay = formatDate(current, "dd/MM/yyyy");

          if (isAfter(current, habit.start_date) && isBefore(current, habit.end_date)) {
            return {
              ...previous,
              [currentDay]: habit
            }
          } else {
            return {
              ...previous,
              [currentDay]: null
            }
          }
        }, {})
      }));

      // console.log(habitsWithDates);

      setHabitItens(habitsWithDates);
    } catch (error) {
      console.error(error);
    }
  }, [firstDayOfMonth, daysInMonth]);


  const handleSubmit = async (params: any) => {
    const { data } = await createHabit({
      name: params.name,
      start_date: params.start_date,
      end_date: params.end_date,
      infinite: params.infinite
    });

    // console.log(params);
    setCreateHabitOpen(false);
  }

  const handleError = (error: any) => {
    console.log(error);

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
              {/* <Button variant="outline" className="flex gap-2 rounded-xl h-8" onClick={() => logout()}> */}
              {/* Sair */}
              {/* <LogOut size={16} /> */}
              {/* </Button> */}
            </div>
          </div>
        </header>

        <div className="max-w-screen-lg mx-auto px-6 pt-16 ">
          <div className="flex items-center justify-between">
            <h1 className="font-sans text-xl font-medium">Olá {'a'}, aqui está seu jornal!</h1>

            <Dialog open={createHabitOpen}>
              <DialogTrigger>

                <Button className="flex gap-2 bg-black rounded-xl text-white" onClick={() => setCreateHabitOpen(true)}>
                  Adicionar
                  <PlusCircle size={16} />
                </Button>

              </DialogTrigger>
              <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Criar hábito</DialogTitle>
                  <DialogDescription className="text-black/70">
                    Defina a data de início e fim do hábito
                  </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                  <div className="space-y-4 py-4 px-6 pb-8">
                    <div>
                      <TextField
                        name="name"
                        label="Nome do hábito"
                        placeholder="Ex: Beber água"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <DatePickerField name="start_date" label="Data de início"
                          disabled={(date) => {
                            if (isBefore(date, sub(new Date(), { days: 1 }))) {
                              return true;
                            }

                            if (endDate && isBefore(date, endDate)) {
                              return false;
                            }

                            return false;
                          }} />
                      </div>
                      <div>
                        <DatePickerField name="end_date" label="Data de fim" disabled={(date) => {
                          if (isBefore(date, sub(new Date(), { days: 0 }))) {
                            return true;
                          }

                          if (isBefore(date, form.getValues('startDate'))) {
                            return true;
                          }

                          return false;
                        }} />
                        <div className="flex items-center gap-2 mt-2">
                          <CheckboxField className="rounded" name="infinite" />
                          <p className="text-sm font-medium">Infinito</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end p-4 border-t">
                    <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80"
                      onClick={form.handleSubmit(handleSubmit, handleError)}
                    >
                      Criar
                    </Button>
                  </div>
                </FormProvider>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap mb-2">
              <div className="w-16" />

              {daysInMonth.map((_, index) => (
                <div className="w-7 h-7 flex items-end justify-center text-xs font-bold">
                  {index + 1}
                </div>
              ))}
            </div>
            <div>


              {habits?.map((item) => (
                <div className="flex flex-wrap">
                  <div className="flex items-center gap-4 w-16">
                    <p className="text-xs font-bold">{item.name}</p>
                  </div>

                  <div className="flex flex-wrap">
                    {daysInMonth.map((item, index) => {
                      const realDay = index + 1;

                      return (
                        <button className={cn("w-7 h-7 flex items-end justify-center border border-neutral-300 disabled:border-neutral-300/30 disabled:cursor-not-allowed enabled:hover:border-black data-[is-current-day=true]:border-neutral-400",
                        )}
                          data-is-current-day={realDay === currentDay}
                          disabled={realDay > currentDay || realDay < currentDay}
                        >
                        </button>
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