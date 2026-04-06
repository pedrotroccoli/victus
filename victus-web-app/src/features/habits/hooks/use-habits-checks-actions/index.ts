import { format, isSameDay } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import { useCheckHabit, useGetHabitsCheck, useUpdateHabitCheck } from "@/services/habits/hooks";
import { DateFormat } from "@/services/habits/types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";
import { OnSaveDeltaModalProps } from "../../components/templates/fill-delta-modal";

const PARENT_CHECK_DELAY_MS = 1000;

interface UseHabitCheckingActionsProps {
  startRange: Date;
  endRange: Date;
  enabled?: boolean;
  habits?: Habit[];
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
  enabled,
  habits = []
}: UseHabitCheckingActionsProps): UseCheckActions => {
  const queryClient = useQueryClient();
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

  // Optimistically update parent check in cache
  const optimisticallyCheckParent = useCallback((parentId: string) => {
    const optimisticCheck: HabitCheck = {
      _id: `temp-parent-${Date.now()}`,
      account_id: '',
      habit_id: parentId,
      checked: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    queryClient.setQueriesData<HabitCheck[]>({ queryKey: ['checks'] }, (old = []) => {
      // Check if there's already a check for this habit today
      const existingCheck = old.find(
        c => c.habit_id === parentId && isSameDay(new Date(c.created_at), new Date())
      );

      if (existingCheck) {
        // Update existing check
        return old.map(item =>
          item._id === existingCheck._id ? { ...item, checked: true } : item
        );
      }

      // Add new optimistic check
      return [...old, optimisticCheck];
    });
  }, [queryClient]);

  const [fillDeltaModalOpen, setFillDeltaModalOpen] = useState<{
    check: HabitCheck;
    habit: Habit;
  }>();

  // Helper to find a habit by ID (including nested children)
  const findHabitById = (habitId: string, habitsList: Habit[] = habits): Habit | undefined => {
    for (const h of habitsList) {
      if (h._id === habitId) return h;
      if (h.children_habits?.length) {
        const found = findHabitById(habitId, h.children_habits);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Check if parent's rule engine criteria is met
  const isParentRuleEngineSatisfied = (
    parent: Habit,
    checksData: HabitCheck[],
    newlyCheckedHabitIds: string[] = []
  ): boolean => {
    if (!parent.rule_engine_enabled || !parent.rule_engine_details?.logic) return false;

    const logic = parent.rule_engine_details.logic;
    const logicType = logic.type;
    const habitIds = logicType === 'or' ? (logic as HabitRuleLogicOr).or : (logic as HabitRuleLogicAnd).and;

    if (!habitIds?.length) return false;

    const isHabitCheckedToday = (habitId: string): boolean => {
      // If this is one of the habits we just checked in this chain, consider it checked
      if (newlyCheckedHabitIds.includes(habitId)) return true;

      return checksData.some(
        check => check.habit_id === habitId &&
                 isSameDay(check.created_at, new Date()) &&
                 check.checked
      );
    };

    if (logicType === 'or') {
      // OR: at least one habit must be checked
      return habitIds.some(isHabitCheckedToday);
    }
      // AND: all habits must be checked
      return habitIds.every(isHabitCheckedToday);
    
  };

  // Recursively check parent habits up the chain
  const checkParentChain = async (
    habit: Habit,
    checkedHabitIds: string[]
  ): Promise<void> => {
    if (!habit.parent_habit_id) return;

    const parent = findHabitById(habit.parent_habit_id);
    if (!parent || !parent.rule_engine_enabled) return;

    // Check if parent is not already checked today
    const parentCheck = data?.find(
      c => c.habit_id === parent._id && isSameDay(c.created_at, new Date())
    );

    if (parentCheck?.checked) return;

    // Check if rule engine criteria is satisfied
    // Include all habits we've checked in this chain
    const isSatisfied = isParentRuleEngineSatisfied(parent, data || [], checkedHabitIds);

    if (isSatisfied) {
      // 1. Optimistically update the cache immediately
      optimisticallyCheckParent(parent._id);
      toast.success(`${parent.name} completado automaticamente!`);

      // 2. Delay the actual API call to avoid race condition with backend
      setTimeout(async () => {
        try {
          await checkHabit({
            habit_id: parent._id,
            check_id: parentCheck?._id,
            checked: true,
          });
        } catch {
          // If API call fails, revert the optimistic update
          queryClient.invalidateQueries({ queryKey: ['checks'] });
          toast.error(`Erro ao marcar ${parent.name}`);
        }
      }, PARENT_CHECK_DELAY_MS);

      // 3. Recursively check grandparent (also with delay built into the chain)
      await checkParentChain(parent, [...checkedHabitIds, parent._id]);
    }
  };

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

      // Check parent chain recursively
      await checkParentChain(habit, [habit._id]);
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
