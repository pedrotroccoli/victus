import { useLocalStorage } from "@uidotdev/usehooks";
import { eachDayOfInterval, subDays, addDays } from "date-fns";
import {
  LoaderCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import { useMe } from "@/services/auth";
import {
  useUpdateHabit,
} from "@/services/habits/hooks";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HabitLineChange,
  HabitLines,
} from "@/features/habits/components/templates/habit-lines";

import { useTranslation } from "react-i18next";

import { HabitCheckboxes } from "@/features/habits/components/templates/habit-checkboxes";
import { TrialMessage } from "@/features/account/components/atoms/trial-message";
import { DashboardHeader } from "./components/header";
import { DashboardPaperActions } from "./components/paper-actions";

import { DashboardNoContent } from "./components/page-no-content";
import { DashboardPageError } from "./components/page-error";
import { DashboardPageLoader } from "./components/page-loader";
import { useDashboard } from "./providers/dashboard-provider";
import { generateHabitsHash } from "./utils";

export interface DeltaInfo {
  open?: boolean;
  habit?: Habit;
  deltaId?: string;
  type: "create" | "edit";
  newDeltas?: { name: string; type: "number" | "time"; _id: string }[];
}

export const Home = () => {
  const { t } = useTranslation("dashboard");

  const { data: me, isLoading: isLoadingMe, error } = useMe();
  const { mutateAsync: updateHabit } = useUpdateHabit();

  const [currentDay, setCurrentDay] = useState(new Date());
  const [editEnabled, setEditEnabled] = useState(false);
  const [tab, setTab] = useLocalStorage("@victus::tab", "focus");
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleDays, setVisibleDays] = useState(10);

  const {
    generalLoading,
    habits,
    categories,
    checks,
  } = useDashboard();

  const habitsCheckedHash = useMemo(() =>
    generateHabitsHash(checks.data), [checks]);

  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  };

  const calculateVisibleDays = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const availableWidth = Math.min(containerWidth - 192, 760);
    const dayBlockSize = 28;
    const days = Math.max(5, Math.floor(availableWidth / dayBlockSize));

    setVisibleDays(days);
  }, []);

  useEffect(() => {
    calculateVisibleDays();

    const resizeObserver = new ResizeObserver(calculateVisibleDays);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculateVisibleDays]);

  const daysInMonth = useMemo(() => {
    const today = new Date();
    // Proporção: ~60% para trás, ~40% para frente
    const daysBack = Math.ceil(visibleDays * 0.6);
    const daysForward = visibleDays - daysBack - 1; // -1 para incluir hoje

    const start = subDays(today, daysBack);
    const end = addDays(today, daysForward);

    return eachDayOfInterval({ start, end });
  }, [visibleDays]);

  useEffect(() => {
    const oneMinute = 1000 * 60;

    setCurrentDay(new Date());

    const interval = setInterval(() => {
      setCurrentDay(new Date());
    }, oneMinute);

    return () => clearInterval(interval);
  }, []);

  const onHabitChange = (habitChange: HabitLineChange) => {
    if (habitChange.type.includes("check")) {
      checks.create(habitChange.habit);
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
    habits.setDeleteModalOpen(habit);
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
            habits={habits.data || []}
            habitCategories={categories.data || []}
            deltaOpen={undefined}
            setDeltaOpen={() => {}}
            onCreateHabit={() => habits.setCreateModalOpen(true)}
          />

          <div id="dashboard-habits" ref={containerRef} className="mt-6 sm:mt-8 bg-white w-full">
            <div className="w-full">
              {habits && habits.data.length === 0 && !generalLoading && (
                <DashboardNoContent />
              )}

              {generalLoading && (
                <DashboardPageLoader />
              )}

              {error && (
                <DashboardPageError />
              )}

              {habits && habits.data.length > 0 && !generalLoading && (
                <div className="border border-neutral-300 rounded-md">
                  <DashboardPaperActions
                    editEnabled={editEnabled}
                    onClickAddHabit={() => habits.setCreateModalOpen(true)}
                    onClickEditEnabled={() => setEditEnabled(!editEnabled)}
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-[Recursive] font-medium">
                      {t("habits.title")}
                    </h3>
                  </div>
                  <div className="">
                    <div className="border-t border-neutral-300"></div>
                    <Tabs
                      defaultValue={'focus'}
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
                          onEditHabit={habits.setEditModalOpen}
                          onDeleteHabit={onDeleteHabit}
                          categories={categories.data}
                          habits={habits.data}
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
                          habits={habits.data}
                          habitCategories={categories.data}
                          currentDay={currentDay}
                          habitsCheckedHash={habitsCheckedHash}
                          onCheckHabit={checks.create}
                          onEditHabit={habits.setEditModalOpen}
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
    </>
  );
};

