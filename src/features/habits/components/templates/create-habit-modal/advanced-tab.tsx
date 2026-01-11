import { useGetHabits } from "@/services/habits/hooks";
import { addYears, subYears } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ParentHabitSection } from "./parent-habit-section";
import { RuleEngineSection } from "./rule-engine-section";

interface AdvancedTabProps {
  habits?: Habit[];
  habit?: Habit;
}

export function AdvancedTab({ habits: propHabits, habit }: AdvancedTabProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' });

  // Fetch all habits with a wide date range to ensure we get everything
  const { data: fetchedHabits } = useGetHabits({
    start_date: subYears(new Date(), 10).toISOString().split('T')[0] as `${number}-${number}-${number}`,
    end_date: addYears(new Date(), 10).toISOString().split('T')[0] as `${number}-${number}-${number}`,
  }, {});

  // Use fetched habits if available, otherwise fall back to prop habits
  const habits = useMemo(() => {
    return fetchedHabits || propHabits || [];
  }, [fetchedHabits, propHabits]);

  const hasChildren = habit?.children_habits && habit.children_habits.length > 0;

  return (
    <div className="grid gap-6 px-6 pb-8">
      <ParentHabitSection habits={habits} currentHabitId={habit?._id} />

      {hasChildren && (
        <>
          <div className="border-t border-neutral-200 my-px"></div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('form.sections.rule_engine')}</h3>
            <RuleEngineSection childrenHabits={habit?.children_habits} allHabits={habits} />
          </div>
        </>
      )}
    </div>
  );
}
