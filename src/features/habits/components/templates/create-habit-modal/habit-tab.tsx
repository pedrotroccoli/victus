import { TextField } from "@/components/molecules/form";
import { CheckboxField } from "@/components/molecules/form/CheckboxField";
import { ComboBoxField } from "@/components/molecules/form/combo-box-field";
import { DatePickerField } from "@/components/molecules/form/DatePickerField";
import { SelectField } from "@/components/molecules/form/SelectField";
import { ToggleGroupField } from "@/components/molecules/form/ToggleGroupField";
import { format, isBefore, sub } from "date-fns";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateHabitForm } from "./types";
import { daysOfWeek, daysOfWeekTranslation } from "./utils";

interface HabitTabProps {
  categories?: HabitCategory[];
  habit?: Habit;
  endDate?: Date;
}

const daysOfWeekOptions = daysOfWeek.map(item => ({
  label: daysOfWeekTranslation[item as keyof typeof daysOfWeekTranslation],
  value: item,
}))

export function HabitTab({ categories, habit, endDate }: HabitTabProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' })
  const form = useFormContext<CreateHabitForm>();

  const categoriesOptions = useMemo(() => {
    const list = [{ label: 'Sem categoria', value: undefined }] as { label: string; value: string | undefined }[];

    list.push(...categories?.map(category => ({ label: category.name, value: category._id })) || []);

    return list || [];
  }, [categories]);


  return (
    <div className="grid gap-4 px-6 pb-8">
      <div>
        <TextField
          name="name"
          label={t('form.fields.name.label')}
          placeholder={t('form.fields.name.placeholder')}
        />
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
          <ComboBoxField
            label={t('form.fields.category.label')}
            name="category"
            options={categoriesOptions}
            placeholder={t('form.fields.category.placeholder')}
            commandPlaceholder={t('form.fields.category.commandPlaceholder')}
            commandEmpty={t('form.fields.category.commandEmpty')}
          />
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

            return false;
          }}
            disabledMessage={habit ? habit.end_date ? format(habit.end_date, 'dd/MM/yyyy') : 'Sem fim' : form.watch('infinite') ? 'Sem fim' : undefined}
          />
          <div className="flex items-center gap-2 mt-2">
            <CheckboxField className="rounded" name="infinite" disabled={!!habit} />
            <p className="text-sm font-medium">{t('form.fields.infinite.label')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}