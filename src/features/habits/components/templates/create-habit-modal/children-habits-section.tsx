import { MultiComboBoxField } from "@/components/molecules/form/MultiComboBoxField";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ChildrenHabitsSectionProps {
  habits: Habit[];
  currentHabitId?: string;
}

export function ChildrenHabitsSection({ habits, currentHabitId }: ChildrenHabitsSectionProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' });

  const habitOptions = useMemo(() => {
    return habits
      .filter((habit) => {
        // Exclude current habit
        if (habit._id === currentHabitId) return false;
        // Exclude habits that already have a parent
        if (habit.parent_habit_id) return false;
        return true;
      })
      .map((habit) => ({
        label: habit.name,
        value: habit._id,
      }));
  }, [habits, currentHabitId]);

  return (
    <div className="space-y-2">
      <MultiComboBoxField
        name="children_habit_ids"
        label={t('form.fields.children_habits.label')}
        placeholder={t('form.fields.children_habits.placeholder')}
        commandPlaceholder={t('form.fields.children_habits.commandPlaceholder')}
        commandEmpty={t('form.fields.children_habits.commandEmpty')}
        options={habitOptions}
      />
      <p className="text-xs text-neutral-500">
        {t('form.fields.children_habits.helper')}
      </p>
    </div>
  );
}
