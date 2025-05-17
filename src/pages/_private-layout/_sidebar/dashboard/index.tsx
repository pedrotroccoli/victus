import { useLocalStorage } from '@uidotdev/usehooks';
import { addDays, eachDayOfInterval, format, isAfter, isBefore, subDays } from "date-fns";
import { Book, BookOpen, Box, CircleAlert, CirclePlus, LoaderCircle, PackagePlus, Pencil, PencilOff, PencilRuler, PlusCircle, Trash, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from 'uuid';


import { useMe } from "@/services/auth";
import { useCheckHabit, useCreateHabit, useDeleteHabit, useGetHabits, useGetHabitsCheck, useUpdateHabit, useUpdateHabitCheck } from "@/services/habits/hooks";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxesExplanation } from "@/features/habits/components/atoms/boxes-explanation";
import { CreateCategoryForm, CreateCategoryModal } from "@/features/habits/components/templates/create-category-modal";
import { CreateDeltaModal } from "@/features/habits/components/templates/create-delta-modal";
import { CreateHabitModal } from "@/features/habits/components/templates/create-habit-modal";
import { CreateHabitModalOnSaveProps } from "@/features/habits/components/templates/create-habit-modal/types";
import { DeleteHabitModal } from "@/features/habits/components/templates/delete-habit-modal";
import FillDeltaModal, { OnSaveDeltaModalProps } from "@/features/habits/components/templates/fill-delta-modal";
import { HabitLineChange, HabitLines } from "@/features/habits/components/templates/habit-lines";
import { groupByCategory } from "@/features/habits/components/templates/habit-lines/utils";
import { cn } from "@/lib/utils";
import { useCreateHabitCategory, useHabitCategories } from "@/services/habit-category/hooks";
import { DateFormat } from "@/services/habits/types";
import { isAcceptedByRRule, isInfiniteHabit } from "@/utils/habits";
import { MiniKit } from '@worldcoin/minikit-js';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

export const Home = () => {
  const { t } = useTranslation('dashboard');
  const { t: tCommon } = useTranslation('common');

  const startRange = subDays(new Date(), 12);
  const endRange = addDays(new Date(), 12);

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
  const { mutateAsync: updateHabit } = useUpdateHabit();
  const { mutateAsync: updateHabitCheck } = useUpdateHabitCheck();

  const { data: habitCategories, isLoading: isLoadingHabitCategories } = useHabitCategories();
  const { mutateAsync: createHabitCategory } = useCreateHabitCategory();
  const { mutateAsync: deleteHabit } = useDeleteHabit();
  const [trialAlert, setTrialAlert] = useState(() => {
    const vjta = localStorage.getItem('@victus::vjta');

    if (!vjta) return true;

    return isAfter(new Date(), new Date(vjta));
  });

  const generalLoading = useMemo(() => isLoadingMe || isLoadingHabits || isLoadingHabitsCheck || isLoadingHabitCategories, [isLoadingMe, isLoadingHabits, isLoadingHabitsCheck, isLoadingHabitCategories]);

  const [hideExplanation, setHideExplanation] = useState(true);
  const [editEnabled, setEditEnabled] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [fillDeltaModal, setFillDeltaModal] = useState<{
    habit: Habit;
    habitCheck: HabitCheck;
  } | null>(null);

  const [tab, setTab] = useLocalStorage('@victus::tab', 'focus');

  const [deltaOpen, setDeltaOpen] = useState<{
    open?: boolean;
    habit?: Habit;
    deltaId?: string;
    type: 'create' | 'edit';
    newDeltas?: { name: string, type: 'number' | 'time', _id: string }[];
  } | null>(null);

  const habitsCheckedHash = useMemo(() => {
    if (!habitsCheck) return {};

    return habitsCheck.reduce((previous: Record<string, Record<string, HabitCheck>>, current: HabitCheck) => {

      if (!current.created_at) return previous;

      return ({
        ...previous,
        [current.habit_id]: {
          ...(previous[current.habit_id] || {}),
          [format(current.created_at, 'MM/dd/yyyy')]: current
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
        },
        habit_deltas: deltaOpen?.newDeltas?.map(item => ({
          name: item.name,
          type: item.type
        })) || []
      });


      toast.success('Hábito criado com sucesso!');

      setDeltaOpen(null);
      setCreateHabitOpen(false);
    } catch (error) {
      toast.error('Erro ao criar hábito!');
    }
  }

  const onClickCreateHabit = () => {
    setCreateHabitOpen(true);
  }

  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  }

  const handleCheckHabit = async (habit: Habit, formattedDay: string) => {
    const habitCheck = getHabitCheck(habit, formattedDay);

    const check = await checkHabit({
      habit_id: habit._id,
      check_id: habitCheck?._id,
      checked: !habitCheck?.checked
    });

    if (!habitCheck?.checked) {
      toast.success(`${habit.name} marcado com sucesso! :D`);
    } else {
      toast.info(`${habit.name} desmarcado com sucesso! :(`);
    }

    if (habit.habit_deltas?.length && (habitCheck ? !habitCheck.checked : true)) {
      setFillDeltaModal({
        habit: habit,
        habitCheck: check
      });
    }
  }

  const handleCreateCategory = async (data: CreateCategoryForm) => {
    try {
      let highestOrder = Number(habitCategories?.sort((a, b) => a.order - b.order).pop()?.order) || 1000;

      highestOrder += 1000;
      highestOrder = Number(highestOrder.toFixed(0));

      await createHabitCategory({
        name: data.name,
        order: highestOrder
      });

      setCreateCategoryOpen(false);
    } catch (error) {
      toast.error('Erro ao criar categoria!');
    }
  }

  const onHabitChange = (habitChange: HabitLineChange) => {
    if (habitChange.type.includes('check')) {
      handleCheckHabit(habitChange.habit, format(currentDay, 'MM/dd/yyyy'));
    }

    if (habitChange.type.includes('order') || habitChange.type.includes('category')) {
      updateHabit({
        _id: habitChange.habit._id,
        order: habitChange.habit.order,
        habit_category_id: habitChange.habit.habit_category_id
      });
    }
  }

  const onDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit);
  }

  const onDeleteHabitConfirm = () => {
    deleteHabit(habitToDelete?._id || '');
  }

  const handleEditHabit = (habit: Habit) => {
    setEditHabit(habit);
  }


  const handleEditHabitSave = (data: CreateHabitModalOnSaveProps) => {
    if (!editHabit) return;

    updateHabit({
      _id: editHabit._id,
      name: data.name,
      recurrence_type: data.frequency,
      recurrence_details: {
        rule: data.rrule
      },
      habit_deltas_attributes: [
        ...(editHabit?.habit_deltas?.map(item => ({
        id: item?._id,
        name: item.name,
        type: item.type,
        enabled: true,
        _destroy: false
      })) || []),
      ...(deltaOpen?.newDeltas?.map(item => ({
        name: item.name,
        type: item.type,
        enabled: true,
        _destroy: false
      })) || [])
    ]
    });

    toast.success('Hábito atualizado com sucesso!');

    setDeltaOpen(null);
    setEditHabit(null);
  }

  const handleDisableTrialAlert = () => {
    localStorage.setItem('@victus::vjta', addDays(new Date(), 1).toISOString());
    setTrialAlert(false);
  }

  const handleFillDeltaModalSave = async (data: OnSaveDeltaModalProps) => {
    if (!fillDeltaModal) return;

    console.log(fillDeltaModal, data);

    await updateHabitCheck({
      habit_id: fillDeltaModal?.habit?._id,
      check_id: fillDeltaModal?.habitCheck?._id,
      habit_check_deltas_attributes: data.deltas.map(item => ({
        _id: item?._id || undefined,
        habit_delta_id: item.habit_delta_id,
        value: item.value
      }))
    });

    toast.success('Delta Preenchido com sucesso!');

    setFillDeltaModal(null);
  }

  const onSaveDelta = (data: { name: string, type: 'number' | 'time' }) => {
    if (deltaOpen?.type === 'create') {
      setDeltaOpen(prev => ({
        type: 'create',
        open: false,
        newDeltas: [
          ...(prev?.newDeltas || []), 
          { name: data.name, type: data.type, _id: uuidv4() }
        ] as { name: string, type: 'number' | 'time', _id: string }[]
      }));


      return;
    }

    const delta = deltaOpen?.habit?.habit_deltas?.find(item => item._id === deltaOpen?.deltaId) as HabitDelta;

    if (delta) {
      setEditHabit(prev => ({
        ...(prev as Habit),
        habit_deltas: [
          ...(prev?.habit_deltas?.filter(item => item._id !== deltaOpen?.deltaId) || []),
          {
            ...delta,
            name: data.name,
            type: data.type
          }
        ]
      }));
    }

    setDeltaOpen(null);
  }

  const name = useMemo(() => {
    if (!me) return '';

    if (me?.connected_providers?.includes('worldapp')) {
      return MiniKit.user.username;
    }

    return me?.name ? String(me?.name).split(' ')[0] : '';

  }, [me?.name])

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
        <title>{t('page.title')}</title>
      </Helmet>

      <section className="max-w-screen-lg w-full mx-auto bg-sign">
        <div className="sm:px-4 pt-4 sm:pt-8">
          {me?.subscription?.sub_status === 'trial' && trialAlert && (
            <div className="relative ">
              <Alert className="border-yellow-600 bg-yellow-500/10 mb-12">
                <CircleAlert className="h-4 w-4 fill-yellow-500" />
                <AlertTitle>{t('trial_period.title')}</AlertTitle>
                <AlertDescription className="mt-2 leading-[150%]">
                  {t('trial_period.description', { date: format(me?.subscription?.service_details?.trial_ends_at, 'dd/MM/yyyy') })}
                </AlertDescription>
              </Alert>
              <X size={16} className="cursor-pointer absolute top-2.5 right-2.5 " onClick={handleDisableTrialAlert} />
            </div>
          )}

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
            <h1 className="font-[Recursive] text-xl font-semibold">{t('greeting', { name })}</h1>

            <Dialog open={createHabitOpen} onOpenChange={setCreateHabitOpen}>
              <DialogTrigger asChild>
                <Button className="w-full flex gap-4 bg-black rounded-md text-white sm:max-w-40" onClick={() => setCreateHabitOpen(true)}>
                  <PlusCircle size={16} />
                  {tCommon('add')}
                </Button>
              </DialogTrigger>

              <CreateHabitModal onSave={onCreateHabit} categories={habitCategories || []} newDeltas={deltaOpen?.newDeltas} onCreateDelta={() => setDeltaOpen({
                open: true,
                type: 'create',
                habit: undefined,
                deltaId: '',
                newDeltas: []
              })} />
            </Dialog>
          </div>

          <div className="mt-6 sm:mt-8 bg-white w-full">

            <div className="w-full">
              {habits && habits.length === 0 && (
                <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
                  <Box size={32} strokeWidth={1.5} />

                  <p className="text-lg text-black/75 font-medium mt-4 mb-8 font-[Recursive]">{t('habits.no_habits')}</p>

                  <Button className="flex gap-4 bg-black rounded-md text-white font-[Recursive]" onClick={() => setCreateHabitOpen(true)}>
                    <PlusCircle size={16} />
                    {t('habits.create_first_habit')}
                  </Button>
                </div>
              )}

              {generalLoading && (
                <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
                  <LoaderCircle size={32} className="animate-spin" strokeWidth={1.75} />
                </div>
              )}

              {habits && habits.length > 0 && !generalLoading && (
                <div className="border border-neutral-300 rounded-md">
                  <div className={
                    cn(
                      "flex items-center justify-between border-b border-neutral-300 p-4 pr-8 relative",
                      hideExplanation && "border-b-0 p-0 pr-0"
                    )
                  }>
                    <div className="absolute top-0 right-0 border-l border-b border-neutral-300 rounded-bl-md flex items-center divide-x divide-neutral-300">


                      <button className={
                        cn(
                          "h-6 w-5 flex items-center justify-center",
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

                      <button className={
                        cn(
                          "h-6 w-6 flex items-center justify-center",
                          "hover:bg-black hover:text-white duration-200 transition-colors"
                        )
                      }
                        onClick={() => setEditEnabled(!editEnabled)}
                      >
                        {editEnabled ? (
                          <PencilOff size={12} className="-translate-y-px translate-x-px" />
                        ) : (
                          <PencilRuler size={14} className="-translate-y-px translate-x-px" />
                        )}
                      </button>

                      <button className={
                        cn(
                          "h-6 w-6 flex items-center justify-center",
                          "hover:bg-black hover:text-white duration-200 transition-colors"
                        )
                      }
                        onClick={() => setCreateCategoryOpen(true)}
                      >
                        <PackagePlus size={14} className="-translate-y-px translate-x-px" />
                      </button>

                      <button className={
                        cn(
                          "h-6 w-6 flex items-center justify-center",
                          "hover:bg-black hover:text-white duration-200 transition-colors"
                        )
                      }
                        onClick={onClickCreateHabit}
                      >
                        <CirclePlus size={14} className="-translate-y-px translate-x-px" />
                      </button>

                    </div>

                    {!hideExplanation && (
                      <BoxesExplanation />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-[Recursive] font-medium">{t('habits.title')}</h3>
                  </div>


                  <div className="">
                    <div className="border-t border-neutral-300" ></div>
                    <Tabs defaultValue={tab} className="w-full p-4 pt-6" onValueChange={setTab}>
                      <TabsList className="border border-neutral-300 p-0 h-auto">
                        <TabsTrigger value="general" className="text-xs py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=disabled]:bg-transparent data-[state=disabled]:text-black data-[state=disabled]:border-black">
                          {t('habits.tab_general')}
                        </TabsTrigger>
                        <TabsTrigger value="focus" className="text-xs py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=disabled]:bg-transparent data-[state=disabled]:text-black data-[state=disabled]:border-black">
                          {t('habits.tab_focus')}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="general" className="w-full pt-2">
                        <HabitLines
                          onEditHabit={handleEditHabit}
                          onDeleteHabit={onDeleteHabit}
                          categories={habitCategories || []}
                          habits={habits}
                          orderEnabled={editEnabled}
                          daysInMonth={daysInMonth}
                          getHabitCheck={getHabitCheck}
                          currentDay={currentDay}
                          onHabitChange={onHabitChange}
                          editEnabled={editEnabled}
                        />
                      </TabsContent>
                      <TabsContent value="focus" className="pt-2">
                        <div className="grid gap-6">
                          {Object.entries(groupByCategory(habits, habitCategories || [])).filter(([_, category]) => category?.list?.length > 0).map(([id, category]) => {
                            return (
                              <div key={id}>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-[2px] h-6 bg-black"></div>
                                  <h4 className="font-[Recursive] font-medium">{category?.category?.name}</h4>
                                </div>
                                <ul className="grid gap-2">
                                  {category.list.filter((habit) => {
                                    const isAccepted = isAcceptedByRRule(habit, format(currentDay, 'MM/dd/yyyy'));
                                    const startsBeforeCurrentDay = isBefore(habit.start_date, currentDay);
                                    const endsAfterCurrentDay = isInfiniteHabit(habit) ? true : isAfter(habit.end_date, currentDay);

                                    if (isAccepted && startsBeforeCurrentDay && endsAfterCurrentDay) return true;

                                    return false;
                                  }).map((habit) => {

                                    const checked = getHabitCheck(habit, format(currentDay, 'MM/dd/yyyy'))?.checked || false;

                                    return (
                                      <li key={habit._id} className="flex gap-4">
                                        <button className="flex items-center gap-4" onClick={() => handleCheckHabit(habit, format(currentDay, 'MM/dd/yyyy'))}>
                                          <label className="flex items-center gap-4">
                                            <Checkbox className="w-5 h-5" checked={checked} />
                                            <p className={cn("font-medium text-left truncate text-ellipsis", checked && "text-black/50 line-through")}>{habit.name}</p>
                                          </label>
                                        </button>
                                        {editEnabled && (

                                        <div className='flex items-center gap-2'>
                                        <button className="flex items-center justify-center w-6 h-6 border border-neutral-300 rounded-full" onClick={() => handleEditHabit(habit)}>
                                          <Pencil size={12} className="text-neutral-500" />
                                        </button>
                                        <button className="flex items-center justify-center w-6 h-6 border border-neutral-300 rounded-full" onClick={() => onDeleteHabit(habit)}>
                                          <Trash size={12} className="text-neutral-500" />
                                        </button>
                                        </div>
                                        )}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            )
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="w-full h-20 "></div>
      </section>

      <Dialog open={!!editHabit} onOpenChange={() => setEditHabit(null)}>
        <CreateHabitModal 
          newDeltas={deltaOpen?.newDeltas}
          onSave={handleEditHabitSave} 
          habit={editHabit || undefined} 
          categories={habitCategories || []}
          onEditDelta={(deltaId) => {
            setDeltaOpen({
              habit: editHabit as Habit,
              deltaId,
              type: 'edit',
              open: true
            });
          }}
          onCreateDelta={() => {
            setDeltaOpen({
              habit: editHabit as Habit,
              deltaId: '',
              type: 'create',
              open: true
            });
          }}
        />
      </Dialog>

      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <CreateCategoryModal onSave={handleCreateCategory} />
      </Dialog>

      <Dialog open={!!fillDeltaModal} onOpenChange={() => setFillDeltaModal(null)}>
        <FillDeltaModal habit={fillDeltaModal?.habit} habitCheck={fillDeltaModal?.habitCheck} onSave={handleFillDeltaModalSave} />
      </Dialog>

      <Dialog open={!!deltaOpen?.open} onOpenChange={() => setDeltaOpen(null)}>
        <CreateDeltaModal 
          onSave={onSaveDelta} 
          habit={deltaOpen?.habit} 
          deltaId={deltaOpen?.deltaId}
        />
      </Dialog>

      <AlertDialog open={!!habitToDelete} onOpenChange={() => setHabitToDelete(null)}>
        <DeleteHabitModal habit={habitToDelete || undefined} onConfirm={onDeleteHabitConfirm} onCancel={() => setHabitToDelete(null)} />
      </AlertDialog>
    </>
  )
}