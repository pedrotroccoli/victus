export { };
/*
import axios from "axios";
import { eachDayOfInterval, endOfMonth, formatDate, getDate, getYear, isAfter, isBefore, startOfMonth } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

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


export const Home = () => {
  const firstDayOfMonth = startOfMonth(new Date());
  const lastDayOfMonth = endOfMonth(new Date());

  const currentYear = getYear(new Date());
  const currentDay = getDate(new Date());
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const form = useForm();
  const endDate = form.watch("endDate");

  const [habitItens, setHabitItens] = useState<HabitItem[]>([]);
  const [token, setToken] = useState<string>("");

  const [createHabitOpen, setCreateHabitOpen] = useState(false);

  const getHabits = useCallback(async () => {
    try {
      const token = await getToken();

      console.log(token);

      setToken(token);

      const { data } = await axios.get("http://localhost:3000/habits", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

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

  useEffect(() => {
    getHabits();
  }, [getHabits])

  const handleSubmit = async (params: any) => {
    const { data } = await axios.post("http://localhost:3000/habits", {
      habit: params
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    console.log(data);
    setCreateHabitOpen(false);
  }

  const handleError = (error: any) => { }

  return (
    <>
      {/** 
      <Dialog open={createHabitOpen}>
        <DialogTrigger>Open</DialogTrigger>
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
                <InputField
                  name="name"
                  label="Nome do hábito"
                  placeholder="Ex: Beber água"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DatePickerField name="startDate" label="Data de início"
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
                  <DatePickerField name="endDate" label="Data de fim" />
                  {/* 
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

<main className="max-w-screen-xl mx-auto border-x h-screen">
  <header className="border-b py-4 px-8">
    <div className="flex items-center justify-between">
      <div />

      <div className="">
        {/* <Button variant="outline" className="flex gap-2 rounded-xl h-8" onClick={() => logout()}>
                Sair
                <LogOut size={16} />
              </Button>
      </div>
    </div>
  </header>

  <div className="max-w-screen-lg mx-auto pt-16">
    <div className="flex items-center justify-between">
      <h1 className="font-sans text-xl font-medium">Olá {'a'}, aqui está seu jornal!</h1>

      <Button className="flex gap-2 bg-black rounded-xl text-white" onClick={() => setCreateHabitOpen(true)}>
        Adicionar
        <PlusCircle size={16} />
      </Button>
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


        {habitItens.map(habitItem => (
          <div className="flex flex-wrap">
            <div className="flex items-center gap-4 w-16">
              <p className="text-xs font-bold">{habitItem.habit.name}</p>
            </div>

            <div className="flex flex-wrap">
              {daysInMonth.map((item, index) => (
                <button className={cn("w-7 h-7 flex items-end justify-center border hover:border-black", index === currentDay ? "border-black" : "",
                  `${habitItem.dates[formatDate(item, "dd/MM/yyyy")] ? "" : "bg-neutral-300 border-neutral-300 opacity-50 cursor-not-allowed"}`
                )}>
                </button>
              ))}
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
*/