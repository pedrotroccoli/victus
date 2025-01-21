import { CheckboxField } from '@/components/molecules/form/CheckboxField';
import { DatePickerField } from '@/components/molecules/form/DatePickerField';
import { TextField } from '@/components/molecules/form/TextField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isBefore, sub } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';

export const CreateHabitModal = () => {
  const form = useForm();

  const handleSubmit = (data: any) => {
    console.log(data);
  }

  const handleError = (errors: any) => {
    console.log(errors);
  }

  const endDate = form.watch('infinite') ? undefined : form.watch('end_date');

  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded">
      <DialogHeader className="p-4 border-b">
        <DialogTitle>Criar hábito</DialogTitle>
        <DialogDescription className="text-black/70">
          Defina a data de início e fim do hábito
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="space-y-4 py-4 px-6 pb-8">
          <div>
            <TextField
              name="name"
              label="Nome do hábito"
              placeholder="Ex: Beber água"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePickerField name="start_date" label="Data de início"
                disabled={(date) => {
                  if (isBefore(date, sub(new Date(), { days: 1 }))) {
                    return true;
                  }

                  if (endDate && isBefore(date, endDate)) {
                    return false;
                  }

                  return false;
                }} />
            </div>
            <div>
              <DatePickerField name="end_date" label="Data de fim" disabled={(date) => {
                if (isBefore(date, sub(new Date(), { days: 0 }))) {
                  return true;
                }

                if (isBefore(date, form.getValues('startDate'))) {
                  return true;
                }

                return false;
              }}
                disabledMessage={form.watch('infinite') ? 'Sem fim' : undefined}
              />
              <div className="flex items-center gap-2 mt-2">
                <CheckboxField className="rounded" name="infinite" />
                <p className="text-sm font-medium">Infinito</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80"
            onClick={form.handleSubmit(handleSubmit, handleError)}
          >
            Criar
          </Button>
        </div>
      </FormProvider>
    </DialogContent>

  )
}
