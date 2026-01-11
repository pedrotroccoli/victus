import { CheckboxField } from "@/components/molecules/form/CheckboxField";
import { MultiComboBoxField } from "@/components/molecules/form/MultiComboBoxField";
import { SelectField } from "@/components/molecules/form/SelectField";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateHabitForm } from "./types";

interface RuleEngineSectionProps {
  childrenHabits?: Habit[];
}

export function RuleEngineSection({ childrenHabits }: RuleEngineSectionProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' });
  const form = useFormContext<CreateHabitForm>();

  const ruleEngineEnabled = form.watch('rule_engine_enabled');

  const habitOptions = useMemo(() => {
    return (childrenHabits || []).map((habit) => ({
      label: habit.name,
      value: habit._id,
    }));
  }, [childrenHabits]);

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
