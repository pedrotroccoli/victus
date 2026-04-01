import { ComboBox } from "@/components/atoms/combobox";
import { FieldWrapper } from "@/components/ions/form-field-wrapper";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ParentHabitSectionProps {
  habits: Habit[];
  currentHabitId?: string;
}

// Special value to represent "no parent" since null causes issues with Command component
const NO_PARENT_VALUE = "__no_parent__";

export function ParentHabitSection({ habits, currentHabitId }: ParentHabitSectionProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' });
  const { control } = useFormContext();

  const habitOptions = useMemo(() => {
    const options = habits
      .filter((habit) => {
        // Exclude current habit (can't be its own parent)
        if (habit._id === currentHabitId) return false;
        return true;
      })
      .map((habit) => ({
        label: habit.name,
        value: habit._id,
      }));

    // Add "No parent" option at the beginning with a special string value
    return [
      { label: t('form.fields.parent_habit.no_parent'), value: NO_PARENT_VALUE },
      ...options,
    ];
  }, [habits, currentHabitId, t]);

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name="parent_habit_id"
        render={({ field: { onChange, value } }) => (
          <FieldWrapper label={t('form.fields.parent_habit.label')}>
            <ComboBox
              placeholder={t('form.fields.parent_habit.placeholder')}
              commandPlaceholder={t('form.fields.parent_habit.commandPlaceholder')}
              commandEmpty={t('form.fields.parent_habit.commandEmpty')}
              options={habitOptions}
              // Convert null/undefined to special value for display
              value={value === null || value === undefined ? NO_PARENT_VALUE : value}
              // Convert special value back to null for form state
              onChange={(newValue) => {
                onChange(newValue === NO_PARENT_VALUE ? null : newValue);
              }}
            />
          </FieldWrapper>
        )}
      />
      <p className="text-xs text-neutral-500">
        {t('form.fields.parent_habit.helper')}
      </p>
    </div>
  );
}
