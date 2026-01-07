import { useLocalStorage } from "@uidotdev/usehooks";
import { addDays, eachDayOfInterval, format, subDays } from "date-fns";
import {
  Book,
  BookOpen,
  Box,
  CirclePlus,
  LoaderCircle,
  PackagePlus,
  PencilOff,
  PencilRuler,
  PlusCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";

import { useMe } from "@/services/auth";
import {
  useCheckHabit,
  useCreateHabit,
  useDeleteHabit,
  useGetHabits,
  useGetHabitsCheck,
  useUpdateHabit,
  useUpdateHabitCheck,
} from "@/services/habits/hooks";

import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxesExplanation } from "@/features/habits/components/atoms/boxes-explanation";
import {
  CreateCategoryForm,
  CreateCategoryModal,
} from "@/features/habits/components/templates/create-category-modal";
import { CreateDeltaModal } from "@/features/habits/components/templates/create-delta-modal";
import { CreateHabitModal } from "@/features/habits/components/templates/create-habit-modal";
import { CreateHabitModalOnSaveProps } from "@/features/habits/components/templates/create-habit-modal/types";
import { DeleteHabitModal } from "@/features/habits/components/templates/delete-habit-modal";
import FillDeltaModal, {
  OnSaveDeltaModalProps,
} from "@/features/habits/components/templates/fill-delta-modal";
import {
  HabitLineChange,
  HabitLines,
} from "@/features/habits/components/templates/habit-lines";
import { cn } from "@/lib/utils";
import {
  useCreateHabitCategory,
  useHabitCategories,
} from "@/services/habit-category/hooks";
import { DateFormat } from "@/services/habits/types";
import { MiniKit } from "@worldcoin/minikit-js";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import FixingBug from "@/assets/fixing.svg?react";
import { HabitCheckboxes } from "@/features/habits/components/templates/habit-checkboxes";
import { TrialMessage } from "@/features/account/components/atoms/trial-message";
import { DashboardHeader } from "./components/header";
import { DashboardPaperActions } from "./components/paper-actions";

export interface DeltaInfo {
  open?: boolean;
  habit?: Habit;
  deltaId?: string;
  type: "create" | "edit";
  newDeltas?: { name: string; type: "number" | "time"; _id: string }[];
}

export const Home = () => {
  const { t } = useTranslation("dashboard");

  const startRange = subDays(new Date(), 12);
  const endRange = addDays(new Date(), 12);

  const { data: me, isLoading: isLoadingMe, error } = useMe();
  const { data: habits, isLoading: isLoadingHabits } = useGetHabits(
    {
      start_date: format(startRange, "yyyy-MM-dd") as DateFormat,
      end_date: format(endRange, "yyyy-MM-dd") as DateFormat,
    },
    {
      enabled: !!me,
    },
  );
  const { data: habitsCheck, isLoading: isLoadingHabitsCheck } =
    useGetHabitsCheck(
      {
        start_date: format(startRange, "yyyy-MM-dd") as DateFormat,
        end_date: format(endRange, "yyyy-MM-dd") as DateFormat,
      },
      {
        enabled: !!me && habits && habits.length > 0,
      },
    );
  const { mutateAsync: updateHabit } = useUpdateHabit();
  const { mutateAsync: updateHabitCheck } = useUpdateHabitCheck();

  const { data: habitCategories, isLoading: isLoadingHabitCategories } =
    useHabitCategories();
  const { mutateAsync: createHabitCategory } = useCreateHabitCategory();
  const { mutateAsync: deleteHabit } = useDeleteHabit();

  const generalLoading = useMemo(
    () =>
      isLoadingMe ||
      isLoadingHabits ||
      isLoadingHabitsCheck ||
      isLoadingHabitCategories,
    [isLoadingMe, isLoadingHabits, isLoadingHabitsCheck],
    isLoadingHabitCategories,
  );

  const [hideExplanation, setHideExplanation] = useState(true);
  const [editEnabled, setEditEnabled] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [fillDeltaModal, setFillDeltaModal] = useState<{
    habit: Habit;
    habitCheck: HabitCheck;
  } | null>(null);

  const [tab, setTab] = useLocalStorage("@victus::tab", "focus");

  const [deltaOpen, setDeltaOpen] = useState<DeltaInfo | null>(null);

  const habitsCheckedHash = useMemo(() => {
    if (!habitsCheck) return {};

    return habitsCheck.reduce(
      (
        previous: Record<string, Record<string, HabitCheck>>,
        current: HabitCheck,
      ) => {
        if (!current.created_at) return previous;

        return {
          ...previous,
          [current.habit_id]: {
            ...(previous[current.habit_id] || {}),
            [format(current.created_at, "MM/dd/yyyy")]: current,
          },
        };
      },
      {},
    );
  }, [habitsCheck]);

  const { mutateAsync: checkHabit } = useCheckHabit();
  const { mutateAsync: createHabit } = useCreateHabit();

  const currentDay = useMemo(() => new Date(), []);

  const daysInMonth = eachDayOfInterval({ start: startRange, end: endRange });

  const onCreateHabit = async (params: CreateHabitModalOnSaveProps) => {
    try {
      await createHabit({
        name: params.name,
        start_date: params.start_date,
        end_date: params.end_date,
        infinite: !!params.infinite,
        recurrence_details: {
          rule: params.rrule,
        },
        habit_category_id: params.category || undefined,
        habit_deltas:
          deltaOpen?.newDeltas?.map((item) => ({
            name: item.name,
            type: item.type,
          })) || [],
        rule_engine_enabled: false,
        children_habit_ids: params.children_habit_ids,
      });

      toast.success("Hábito criado com sucesso!");

      setDeltaOpen(null);
      setCreateHabitOpen(false);
    } catch (error) {
      toast.error("Erro ao criar hábito!");
    }
  };

  const onClickCreateHabit = () => {
    setCreateHabitOpen(true);
  };

  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  };

  const handleCheckHabit = async (habit: Habit, formattedDay: string) => {
    const habitCheck = getHabitCheck(habit, formattedDay);

    const check = await checkHabit({
      habit_id: habit._id,
      check_id: habitCheck?._id,
      checked: !habitCheck?.checked,
    });

    if (!habitCheck?.checked) {
      toast.success(`${habit.name} marcado com sucesso! :D`);
    } else {
      toast.info(`${habit.name} desmarcado com sucesso! :(`);
    }

    if (
      habit.habit_deltas?.length &&
      (habitCheck ? !habitCheck.checked : true)
    ) {
      setFillDeltaModal({
        habit: habit,
        habitCheck: check,
      });
    }
  };

  const handleCreateCategory = async (data: CreateCategoryForm) => {
    try {
      let highestOrder =
        Number(
          habitCategories?.sort((a, b) => a.order - b.order).pop()?.order,
        ) || 1000;

      highestOrder += 1000;
      highestOrder = Number(highestOrder.toFixed(0));

      await createHabitCategory({
        name: data.name,
        order: highestOrder,
      });

      setCreateCategoryOpen(false);
    } catch (error) {
      toast.error("Erro ao criar categoria!");
    }
  };

  const onHabitChange = (habitChange: HabitLineChange) => {
    if (habitChange.type.includes("check")) {
      handleCheckHabit(habitChange.habit, format(currentDay, "MM/dd/yyyy"));
    }

    if (
      habitChange.type.includes("order") ||
      habitChange.type.includes("category")
    ) {
      updateHabit({
        _id: habitChange.habit._id,
        order: habitChange.habit.order,
        habit_category_id: habitChange.habit.habit_category_id,
      });
    }
  };

  const onDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const onDeleteHabitConfirm = () => {
    deleteHabit(habitToDelete?._id || "");
  };

  const handleEditHabit = (habit: Habit) => {
    setEditHabit(habit);
  };

  const handleEditHabitSave = (data: CreateHabitModalOnSaveProps) => {
    if (!editHabit) return;

    updateHabit({
      _id: editHabit._id,
      name: data.name,
      recurrence_type: data.frequency,
      recurrence_details: {
        rule: data.rrule,
      },
      habit_deltas_attributes: [
        ...(editHabit?.habit_deltas?.map((item) => ({
          id: item?._id,
          name: item.name,
          type: item.type,
          enabled: true,
          _destroy: false,
        })) || []),
        ...(deltaOpen?.newDeltas?.map((item) => ({
          name: item.name,
          type: item.type,
          enabled: true,
          _destroy: false,
        })) || []),
      ],
    });

    toast.success("Hábito atualizado com sucesso!");

    setDeltaOpen(null);
    setEditHabit(null);
  };

  const handleFillDeltaModalSave = async (data: OnSaveDeltaModalProps) => {
    if (!fillDeltaModal) return;

    await updateHabitCheck({
      habit_id: fillDeltaModal?.habit?._id,
      check_id: fillDeltaModal?.habitCheck?._id,
      habit_check_deltas_attributes: data.deltas.map((item) => ({
        _id: item?._id || undefined,
        habit_delta_id: item.habit_delta_id,
        value: item.value,
      })),
    });

    toast.success("Delta Preenchido com sucesso!");

    setFillDeltaModal(null);
  };

  const onSaveDelta = (data: { name: string; type: "number" | "time" }) => {
    if (deltaOpen?.type === "create") {
      setDeltaOpen((prev) => ({
        type: "create",
        open: false,
        newDeltas: [
          ...(prev?.newDeltas || []),
          { name: data.name, type: data.type, _id: uuidv4() },
        ] as { name: string; type: "number" | "time"; _id: string }[],
      }));

      return;
    }

    const delta = deltaOpen?.habit?.habit_deltas?.find(
      (item) => item._id === deltaOpen?.deltaId,
    ) as HabitDelta;

    if (delta) {
      setEditHabit((prev) => ({
        ...(prev as Habit),
        habit_deltas: [
          ...(prev?.habit_deltas?.filter(
            (item) => item._id !== deltaOpen?.deltaId,
          ) || []),
          {
            ...delta,
            name: data.name,
            type: data.type,
          },
        ],
      }));
    }

    setDeltaOpen(null);
  };

  const name = useMemo(() => {
    if (!me) return "";

    if (me?.connected_providers?.includes("worldapp")) {
      return MiniKit.user.username;
    }

    return me?.name ? String(me?.name).split(" ")[0] : "";
  }, [me]);

  const handlePauseHabit = async (data: { pause: boolean }) => {
    if (!editHabit) return;

    try {
      await updateHabit({
        _id: editHabit._id,
        paused: data.pause,
      });

      toast.success("Hábito pausado com sucesso!");

      setEditHabit(null);
    } catch (error) {
      toast.error("Erro ao pausar hábito!");
    }
  };

  const handleFinishHabit = async () => {
    if (!editHabit) return;

    try {
      await updateHabit({
        _id: editHabit._id,
        finished: true,
      });

      toast.success("Hábito finalizado com sucesso!");

      setEditHabit(null);
    } catch (error) {
      toast.error("Erro ao finalizar hábito!");
    }
  };

  if (isLoadingMe) {
    return (
      <main>
        <div className="h-screen flex items-center justify-center">
          <LoaderCircle size={32} className="animate-spin" strokeWidth={1.75} />
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("page.title")}</title>
      </Helmet>

      <section className="max-w-screen-lg w-full mx-auto bg-sign">
        <div className="sm:px-4 pt-4 sm:pt-8">
          {me?.subscription?.sub_status === "trial" && (
            <TrialMessage subscription={me?.subscription} />
          )}

          <DashboardHeader
            habits={habits || []}
            habitCategories={habitCategories || []}
            deltaOpen={deltaOpen || undefined}
            setDeltaOpen={setDeltaOpen}
            onCreateHabit={onCreateHabit}
          />

          <div className="mt-6 sm:mt-8 bg-white w-full">
            <div className="w-full">
              {habits && habits.length === 0 && !generalLoading && (
                <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
                  <Box size={32} strokeWidth={1.5} />

                  <p className="text-lg text-black/75 font-medium mt-4 mb-8 font-[Recursive]">
                    {t("habits.no_habits")}
                  </p>

                  <Button
                    className="flex gap-4 bg-black rounded-md text-white font-[Recursive]"
                    // onClick={() => setCreateHabitOpen(true)}
                  >
                    <PlusCircle size={16} />
                    {t("habits.create_first_habit")}
                  </Button>
                </div>
              )}

              {generalLoading && (
                <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
                  <LoaderCircle
                    size={32}
                    className="animate-spin"
                    strokeWidth={1.75}
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
                  <FixingBug className="w-full h-full max-w-60" />

                  <h3 className="text-lg font-[Recursive] font-medium mt-4">
                    {t("page.error.title")}
                  </h3>

                  <p className="text-neutral-500 mt-2 text-center">
                    {t("page.error.description")}
                  </p>
                </div>
              )}

              {habits && habits.length > 0 && !generalLoading && (
                <div className="border border-neutral-300 rounded-md">
                  <DashboardPaperActions
                    editEnabled={editEnabled}
                    onClickAddHabit={() => {}}
                    onClickEditEnabled={() => setEditEnabled(!editEnabled)}
                    onClickAddCategory={() => setCreateCategoryOpen(true)}
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-[Recursive] font-medium">
                      {t("habits.title")}
                    </h3>
                  </div>
                  <div className="">
                    <div className="border-t border-neutral-300"></div>
                    <Tabs
                      defaultValue={tab}
                      className="w-full p-4 pt-6"
                      onValueChange={setTab}
                    >
                      <TabsList className="border border-neutral-300 p-0 h-auto">
                        <TabsTrigger
                          value="general"
                          className="text-xs py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=disabled]:bg-transparent data-[state=disabled]:text-black data-[state=disabled]:border-black"
                        >
                          {t("habits.tab_general")}
                        </TabsTrigger>
                        <TabsTrigger
                          value="focus"
                          className="text-xs py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=disabled]:bg-transparent data-[state=disabled]:text-black data-[state=disabled]:border-black"
                        >
                          {t("habits.tab_focus")}
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
                        <HabitCheckboxes
                          habits={habits}
                          habitCategories={habitCategories || []}
                          currentDay={currentDay}
                          habitsCheckedHash={habitsCheckedHash}
                          onCheckHabit={(habit: Habit) =>
                            handleCheckHabit(
                              habit,
                              format(currentDay, "MM/dd/yyyy"),
                            )
                          }
                          onEditHabit={handleEditHabit}
                          onDeleteHabit={onDeleteHabit}
                          editEnabled={editEnabled}
                        />
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
          habits={habits || []}
          categories={habitCategories || []}
          onEditDelta={(deltaId) => {
            setDeltaOpen({
              habit: editHabit as Habit,
              deltaId,
              type: "edit",
              open: true,
            });
          }}
          onCreateDelta={() => {
            setDeltaOpen({
              habit: editHabit as Habit,
              deltaId: "",
              type: "create",
              open: true,
            });
          }}
          onPause={handlePauseHabit}
          onFinish={handleFinishHabit}
        />
      </Dialog>

      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <CreateCategoryModal onSave={handleCreateCategory} />
      </Dialog>

      <Dialog
        open={!!fillDeltaModal}
        onOpenChange={() => setFillDeltaModal(null)}
      >
        <FillDeltaModal
          habit={fillDeltaModal?.habit}
          habitCheck={fillDeltaModal?.habitCheck}
          onSave={handleFillDeltaModalSave}
        />
      </Dialog>

      <Dialog open={!!deltaOpen?.open} onOpenChange={() => setDeltaOpen(null)}>
        <CreateDeltaModal
          onSave={onSaveDelta}
          habit={deltaOpen?.habit}
          deltaId={deltaOpen?.deltaId}
        />
      </Dialog>

      <AlertDialog
        open={!!habitToDelete}
        onOpenChange={() => setHabitToDelete(null)}
      >
        <DeleteHabitModal
          habit={habitToDelete || undefined}
          onConfirm={onDeleteHabitConfirm}
          onCancel={() => setHabitToDelete(null)}
        />
      </AlertDialog>
    </>
  );
};

