import { CheckboxField } from "@/components/molecules/form/CheckboxField";
import { MultiComboBoxField } from "@/components/molecules/form/MultiComboBoxField";
import { SelectField } from "@/components/molecules/form/SelectField";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateHabitForm } from "./types";

interface RuleEngineSectionProps {
  childrenHabits?: Habit[];
  allHabits?: Habit[];
}

// Helper to find a habit by ID in a nested structure
const findHabitById = (habits: Habit[], id: string): Habit | undefined => {
  for (const habit of habits) {
    if (habit._id === id) return habit;
    if (habit.children_habits?.length) {
      const found = findHabitById(habit.children_habits, id);
      if (found) return found;
    }
  }
  return undefined;
};

export function RuleEngineSection({ childrenHabits, allHabits = [] }: RuleEngineSectionProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' });
  const form = useFormContext<CreateHabitForm>();

  const ruleEngineEnabled = form.watch('rule_engine_enabled');
  const selectedHabitIds = form.watch('rule_engine_habit_ids') || [];

  const habitOptions = useMemo(() => {
    // Start with children habits as the base options
    const childrenOptions = (childrenHabits || []).map((habit) => ({
      label: habit.name,
      value: habit._id,
    }));

    // Add any selected habits that aren't in children (for backwards compatibility)
    const childrenIds = new Set(childrenOptions.map(o => o.value));
    const additionalOptions = selectedHabitIds
      .filter(id => !childrenIds.has(id))
      .map(id => {
        const habit = findHabitById(allHabits, id);
        return habit ? { label: habit.name, value: habit._id } : null;
      })
      .filter((opt): opt is { label: string; value: string } => opt !== null);

    return [...childrenOptions, ...additionalOptions];
  }, [childrenHabits, selectedHabitIds, allHabits]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckboxField className="rounded" name="rule_engine_enabled" />
        <p className="text-sm font-medium">{t('form.fields.rule_engine.enabled_label')}</p>
      </div>

      {ruleEngineEnabled && (
        <div className="space-y-4 pl-6 border-l-2 border-neutral-200">
          <SelectField
            name="rule_engine_logic_type"
            label={t('form.fields.rule_engine.logic_type.label')}
            placeholder={t('form.fields.rule_engine.logic_type.placeholder')}
            defaultValue="and"
            options={[
              { label: t('form.fields.rule_engine.logic_type.and'), value: 'and' },
              { label: t('form.fields.rule_engine.logic_type.or'), value: 'or' },
            ]}
          />

          <MultiComboBoxField
            name="rule_engine_habit_ids"
            label={t('form.fields.rule_engine.habits.label')}
            placeholder={t('form.fields.rule_engine.habits.placeholder')}
            commandPlaceholder={t('form.fields.rule_engine.habits.commandPlaceholder')}
            commandEmpty={t('form.fields.rule_engine.habits.commandEmpty')}
            options={habitOptions}
          />

          <p className="text-xs text-neutral-500">
            {form.watch('rule_engine_logic_type') === 'or'
              ? t('form.fields.rule_engine.helper_or')
              : t('form.fields.rule_engine.helper_and')}
          </p>
        </div>
      )}
    </div>
  );
}
