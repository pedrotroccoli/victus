import { TimerClock } from "@/components/atoms/timer-clock";
import { secondsToHHMMSS } from "@/components/ions/time-selector";
import { TextField } from "@/components/molecules/form";
import { TimeField } from "@/components/molecules/form/time-field";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { numberParser } from "@/utils/parsers/number";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldErrors, FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export type OnSaveDeltaModalProps = {
  deltas: {
    _id?: string;
    habit_delta_id: string;
    value: number;
  }[];
}

interface FillDeltaModalProps {
  habit?: Habit;
  habitCheck?: HabitCheck;
  onSave?: (data: OnSaveDeltaModalProps) => void;
}

const fillDeltaValidation = z.object({
  deltas: z.array(z.object({
    _id: z.string().optional(),
    habit_delta_id: z.string(),
    value: z.string().or(z.number()).optional(),
  })),
});

type FillDeltaModalForm = z.infer<typeof fillDeltaValidation>;

export default function FillDeltaModal({ habit, habitCheck, onSave }: FillDeltaModalProps) {
  const { t } = useTranslation('habit');
  const { t: tCommon } = useTranslation('common');

  const deltas = useMemo(() => {
    return habitCheck?.habit_check_deltas?.reduce((acc, delta) => {
      acc[delta.habit_delta_id] = {
        _id: delta._id,
        habit_delta_id: delta.habit_delta_id,
        value: delta.value,
      };
      return acc;
    }, {} as Record<string, {
      _id: string;
      habit_delta_id: string;
      value: number;
    }>)
  }, [habitCheck]);

  const getDefaultValues = useCallback(() => {
    return (habit?.habit_deltas?.map((delta) => {
      const formatValue = delta.type === 'time' ? secondsToHHMMSS(Number(deltas?.[delta._id].value)) : deltas?.[delta._id].value;

      return ({
      _id: deltas?.[delta._id]._id,
      habit_delta_id: delta._id || '',
      value: formatValue || undefined,
    })
    }) || []) as {
        _id?: string;
        habit_delta_id: string;
        value?: string;
      }[]
  }, [habit, deltas]);

  const form = useForm<z.infer<typeof fillDeltaValidation>>({
    resolver: zodResolver(fillDeltaValidation),
    defaultValues: {
      deltas: getDefaultValues(),
    },
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    form.reset({
      deltas: getDefaultValues(),
    });
  }, [habit, deltas, form]);


  const handleSubmit: SubmitHandler<FillDeltaModalForm> = async (data: FillDeltaModalForm) => {
    if (!onSave) return;

    try {
      setLoading(true);

      await onSave?.({
        deltas: data.deltas.map((delta) => ({
          _id: delta?._id,
          habit_delta_id: delta.habit_delta_id,
          value: numberParser(delta.value || '0'),
        })),
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Erro ao preencher deltas');
      setLoading(false);
    }
  }

  const handleError: SubmitErrorHandler<FillDeltaModalForm> = (errors: FieldErrors<FillDeltaModalForm>) => {
    console.log(errors);
  }

  // if (!habit) return null;

  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle className="font-[Recursive]">{t('fill_delta_modal.title')}</DialogTitle>
        <DialogDescription className="text-black/70">
          {t('fill_delta_modal.description')}
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <ul className="grid gap-4 py-4 px-6 pb-8">
          {/* <TimerClock /> */}

          {habit?.habit_deltas?.map((delta, index) => (
            <li key={delta._id}>
              <input type="hidden" value={delta._id} className="hidden w-0 h-0" {...form.register(`deltas.${index}.habit_delta_id`)} />
              <input type="hidden" value={deltas?.[delta._id]._id} className="hidden w-0 h-0" {...form.register(`deltas.${index}._id`)} />
              {delta.type === 'time' ? (
                <>
                  <TimeField
                    name={`deltas.${index}.value`}
                    label={t('fill_delta_modal.form.fields.delta.label', { name: delta.name })}
                    placeholder={t('fill_delta_modal.form.fields.delta.placeholder')}
                    hours
                  />
                </>
              ) : (

                <TextField
                  name={`deltas.${index}.value`}
                  type="tel"
                  label={t('fill_delta_modal.form.fields.delta.label', { name: delta.name })}
                  placeholder={t('fill_delta_modal.form.fields.delta.placeholder')}
                  parser={(value) => {
                    return String(numberParser(value));
                  }}
                />
              )}
            </li>
          ))}
        </ul>
        <div className="flex justify-end p-2 px-6 border-t border-neutral-300 gap-4">
          <DialogClose disabled={loading}>
            <Button variant="outline" className="bg-white text-black rounded text-sm font-bold hover:bg-neutral-100 min-w-24 h-8 font-[Recursive]"
              onClick={() => setLoading(false)}
              disabled={loading}
            >
              {tCommon('cancel')}
            </Button>
          </DialogClose>
          <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80 min-w-24 h-8 font-[Recursive]"
            onClick={form.handleSubmit(handleSubmit, handleError)}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : tCommon('save')}
          </Button>
        </div>
      </FormProvider>
    </DialogContent>
  );
}