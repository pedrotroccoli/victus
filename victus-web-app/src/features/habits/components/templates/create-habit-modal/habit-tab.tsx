import { ComboBox } from "@/components/atoms/combobox";
import { FieldWrapper } from "@/components/ions/form-field-wrapper";
import { TextField } from "@/components/molecules/form";
import { CheckboxField } from "@/components/molecules/form/CheckboxField";
import { ComboBoxField } from "@/components/molecules/form/combo-box-field";
import { DatePickerField } from "@/components/molecules/form/DatePickerField";
import { SelectField } from "@/components/molecules/form/SelectField";
import { ToggleGroupField } from "@/components/molecules/form/ToggleGroupField";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isAfter, isBefore, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateHabitForm } from "./types";
import { daysOfWeek, daysOfWeekTranslation } from "./utils";

interface HabitTabProps {
  categories?: HabitCategory[];
  habits?: Habit[];
  habit?: Habit;
  endDate?: Date;
}

// Special value to represent "no parent" since null causes issues with Command component
const NO_PARENT_VALUE = "__no_parent__";

const daysOfWeekOptions = daysOfWeek.map(item => ({
  label: daysOfWeekTranslation[item as keyof typeof daysOfWeekTranslation],
  value: item,
}))

export function HabitTab({ categories, habits = [], habit, endDate }: HabitTabProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' })
  const form = useFormContext<CreateHabitForm>();

  // Track if "Child habit" checkbox is checked
  const parentHabitId = form.watch('parent_habit_id');
  const [isChildHabit, setIsChildHabit] = useState(!!parentHabitId && parentHabitId !== null);

  // Update checkbox state when form value changes (e.g., when editing an existing habit)
  useEffect(() => {
    setIsChildHabit(!!parentHabitId && parentHabitId !== null);
  }, [parentHabitId]);

  // Get selected parent habit
  const selectedParentHabit = useMemo(() => {
    if (!isChildHabit || !parentHabitId) return null;
    return habits.find(h => h._id === parentHabitId) || null;
  }, [isChildHabit, parentHabitId, habits]);

  // When parent habit changes, update category to match parent's category
  // and adjust end_date if it exceeds parent's end_date
  useEffect(() => {
    if (isChildHabit && parentHabitId && parentHabitId !== null) {
      const parentHabit = habits.find(h => h._id === parentHabitId);
      if (parentHabit) {
        form.setValue('category', parentHabit.habit_category?._id || null);

        // If parent has an end_date and child's end_date exceeds it, adjust child's end_date
        const currentEndDate = form.getValues('end_date');
        if (parentHabit.end_date && currentEndDate && isAfter(currentEndDate, parentHabit.end_date)) {
          form.setValue('end_date', new Date(parentHabit.end_date));
        }

        // If parent has an end_date and child is set to infinite, unset infinite
        if (parentHabit.end_date && form.getValues('infinite')) {
          form.setValue('infinite', false);
          form.setValue('end_date', new Date(parentHabit.end_date));
        }
      }
    }
  }, [parentHabitId, isChildHabit, habits, form]);

  // When checkbox is unchecked, clear parent_habit_id
  const handleChildHabitToggle = (checked: boolean) => {
    setIsChildHabit(checked);
    if (!checked) {
      form.setValue('parent_habit_id', null);
    }
  };

  const categoriesOptions = useMemo(() => {
    const list = [{ label: 'Sem categoria', value: undefined }] as { label: string; value: string | undefined }[];

    list.push(...categories?.map(category => ({ label: category.name, value: category._id })) || []);

    return list || [];
  }, [categories]);

  // Parent habit options (exclude current habit)
  const parentHabitOptions = useMemo(() => {
    const options = habits
      .filter((h) => h._id !== habit?._id) // Can't be its own parent
      .map((h) => ({
        label: h.name,
        value: h._id,
      }));

    return [
      { label: t('form.fields.parent_habit.no_parent'), value: NO_PARENT_VALUE },
      ...options,
    ];
  }, [habits, habit?._id, t]);


  return (
    <div className="grid gap-4 px-6 pb-8">
      <div>
        <TextField
          name="name"
          label={t('form.fields.name.label')}
          placeholder={t('form.fields.name.placeholder')}
        />
      </div>

      {/* Child habit section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="child-habit-checkbox"
            checked={isChildHabit}
            onChange={(e) => handleChildHabitToggle(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="child-habit-checkbox" className="text-sm font-medium">
            {t('form.fields.child_habit.label')}
          </label>
        </div>

        {isChildHabit && (
          <div className="pl-6 border-l-2 border-neutral-200">
            <Controller
              control={form.control}
              name="parent_habit_id"
              render={({ field: { onChange, value } }) => (
                <FieldWrapper label={t('form.fields.parent_habit.label')}>
                  <ComboBox
                    placeholder={t('form.fields.parent_habit.placeholder')}
                    commandPlaceholder={t('form.fields.parent_habit.commandPlaceholder')}
                    commandEmpty={t('form.fields.parent_habit.commandEmpty')}
                    options={parentHabitOptions}
                    value={value === null || value === undefined ? NO_PARENT_VALUE : value}
                    onChange={(newValue) => {
                      onChange(newValue === NO_PARENT_VALUE ? null : newValue);
                    }}
                  />
                </FieldWrapper>
              )}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('form.fields.parent_habit.helper')}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 my-px"></div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <SelectField
          wrapperClassName={categories && categories.length > 0 ? '' : 'col-span-2'}
          name="frequency"
          label={t('form.fields.frequency.label')}
          placeholder={t('form.fields.frequency.placeholder')}
          defaultValue='daily'
          options={[
            { label: t('form.fields.frequency.options.daily'), value: 'daily' },
            { label: t('form.fields.frequency.options.weekly'), value: 'weekly' },
            // { label: 'Mensal', value: 'monthly' },
            // { label: 'Anual', value: 'yearly' },
          ]}
        />

        {categories && categories.length > 0 && (
          isChildHabit ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ComboBoxField
                      label={t('form.fields.category.label')}
                      name="category"
                      options={categoriesOptions}
                      placeholder={t('form.fields.category.placeholder')}
                      commandPlaceholder={t('form.fields.category.commandPlaceholder')}
                      commandEmpty={t('form.fields.category.commandEmpty')}
                      disabled={true}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('form.fields.category.disabled_tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <ComboBoxField
              label={t('form.fields.category.label')}
              name="category"
              options={categoriesOptions}
              placeholder={t('form.fields.category.placeholder')}
              commandPlaceholder={t('form.fields.category.commandPlaceholder')}
              commandEmpty={t('form.fields.category.commandEmpty')}
            />
          )
        )}

        {form.watch('frequency') === 'weekly' && (
          <div className="mt-4 flex justify-start col-span-2">
            <ToggleGroupField
              name="week_days"
              options={daysOfWeekOptions}
            />
          </div>
        )}

      </div>

      <div className="border-t border-neutral-200 my-px"></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <DatePickerField name="start_date" label={t('form.fields.start_date.label')}
            disabledMessage={habit ? format(habit.start_date, 'dd/MM/yyyy') : undefined}
            disabled={(date) => {
              if (isBefore(date, sub(new Date(), { days: 1 }))) {
                return true;
              }

              if (endDate && isBefore(date, endDate)) {
                return false;
              }

              return false;
            }}
          />
        </div>
        <div>
          <DatePickerField name="end_date" label={t('form.fields.end_date.label')} disabled={(date) => {
            if (isBefore(date, sub(new Date(), { days: 0 }))) {
              return true;
            }

            if (isBefore(date, form.getValues('start_date'))) {
              return true;
            }

            // If parent has end_date, child cannot have end_date after parent's end_date
            if (selectedParentHabit?.end_date && isAfter(date, selectedParentHabit.end_date)) {
              return true;
            }

            return false;
          }}
            disabledMessage={habit ? habit.end_date ? format(habit.end_date, 'dd/MM/yyyy') : t('form.fields.end_date.disabled_message') : form.watch('infinite') ? t('form.fields.end_date.disabled_message') : undefined}
          />
          <div className="flex items-center gap-2 mt-2">
            <CheckboxField
              className="rounded"
              name="infinite"
              disabled={!!habit || (selectedParentHabit?.end_date ? true : false)}
            />
            <p className="text-sm font-medium">{t('form.fields.infinite.label')}</p>
            {selectedParentHabit?.end_date && (
              <span className="text-xs text-neutral-500">
                ({t('form.fields.end_date.parent_limit')})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}