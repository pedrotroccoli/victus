import { format, isSameDay } from "date-fns";

import { useCheckHabit, useGetHabitsCheck, useUpdateHabitCheck } from "@/services/habits/hooks";
import { DateFormat } from "@/services/habits/types";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { OnSaveDeltaModalProps } from "../../components/templates/fill-delta-modal";

interface UseHabitCheckingActionsProps {
  startRange: Date;
  endRange: Date;
  enabled?: boolean
}

export interface UseCheckActions {
  data: HabitCheck[];
  loading: boolean;

  create: (habit: Habit) => Promise<void>;

  fillDeltaModalOpen: boolean;
  habitCheckToFillDelta?: HabitCheck;
  habitToFillDelta?: Habit;
  setFillDeltaModalOpen: Dispatch<SetStateAction<{ check: HabitCheck; habit: Habit } | undefined>>;
  fillDelta: (data: OnSaveDeltaModalProps) => void;
}

export const useHabitsCheckingActions = ({ 
  startRange, 
  endRange,
  enabled
}: UseHabitCheckingActionsProps): UseCheckActions => {
  const { data, isLoading: loading } = useGetHabitsCheck(
    {
      start_date: format(startRange, "yyyy-MM-dd") as DateFormat,
      end_date: format(endRange, "yyyy-MM-dd") as DateFormat,
    },
    {
      enabled,
    },
  );
  const { mutateAsync: updateCheck } = useUpdateHabitCheck();
  const { mutateAsync: checkHabit } = useCheckHabit();

  const [fillDeltaModalOpen, setFillDeltaModalOpen] = useState<{
    check: HabitCheck;
    habit: Habit;
  }>();

  const create = async (habit: Habit) => {
    const check = data?.find(item => item.habit_id === habit._id && isSameDay(item.created_at, new Date()));

    const item = await checkHabit({
      habit_id: habit._id,
      check_id: check?._id,
      checked: !check?.checked,
    });

    if (item?.checked) {
      toast.success(`${habit.name} marcado com sucesso! :D`);

      // Open delta modal if habit has deltas and was just checked
      if (habit.habit_deltas?.length) {
        setFillDeltaModalOpen({
          check: item,
          habit: habit
        });
      }
    } else {
      toast.info(`${habit.name} desmarcado com sucesso! :(`);
    }
  };

  const update = async ({ deltas }: OnSaveDeltaModalProps) => {
    console.log(deltas);

    if (!fillDeltaModalOpen) return;

    await updateCheck({
      habit_id: fillDeltaModalOpen.habit._id,
      check_id: fillDeltaModalOpen.check._id,
      habit_check_deltas_attributes: deltas
    });

    setFillDeltaModalOpen(undefined);
  };

  return {
    data: data || [],
    loading,

    create,

    fillDeltaModalOpen: !!fillDeltaModalOpen,
    habitCheckToFillDelta: fillDeltaModalOpen?.check,
    habitToFillDelta: fillDeltaModalOpen?.habit,
    setFillDeltaModalOpen,
    fillDelta: update
  }
}
