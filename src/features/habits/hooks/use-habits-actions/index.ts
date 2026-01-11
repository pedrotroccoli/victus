import { format } from "date-fns";

import { useCreateHabit, useDeleteHabit, useGetHabits, useUpdateHabit } from "@/services/habits/hooks";
import { DateFormat } from "@/services/habits/types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { CreateHabitModalOnSaveProps } from "../../components/templates/create-habit-modal/types";
import { toast } from "sonner";

interface UseHabitActionsProps {
  startRange: Date;
  endRange: Date;
  enabled?: boolean;
}

export interface UseHabitActions {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean, habit?: Habit) => void;

  editModalOpen: boolean;
  setEditModalOpen: (habit?: Habit) => void;
  habitToEdit?: Habit;

  deleteModalOpen: boolean;
  setDeleteModalOpen: (habit?: Habit) => void;
  habitToDelete?: Habit;
  confirmDeletion: () => void;

  create: (data: CreateHabitModalOnSaveProps) => Promise<void>;

  delta: DeltaInfo | null;
  setDelta: Dispatch<SetStateAction<DeltaInfo | null>>;
  
  data: Habit[];
  loading: boolean;
  error: unknown;

  edit: (data: CreateHabitModalOnSaveProps) => void,

  // handlePauseHabit,
  // handleFinishHabit,
}

export interface DeltaInfo {
  open?: boolean;
  habit?: Habit;
  deltaId?: string;
  type: "create" | "edit";
  newDeltas?: { name: string; type: "number" | "time"; _id: string }[];
}

export const useHabitsActions = ({
  startRange,
  endRange,
  enabled,
}: UseHabitActionsProps): UseHabitActions => {
  const { data, isLoading: loading, error } = useGetHabits(
    {
      start_date: format(startRange, "yyyy-MM-dd") as DateFormat,
      end_date: format(endRange, "yyyy-MM-dd") as DateFormat,
    },
    {
      enabled,
    },
  );
  const { mutateAsync: createHabit } = useCreateHabit();
  const { mutateAsync: updateHabit } = useUpdateHabit();
  const { mutate } = useDeleteHabit();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [habitToEdit, setHabitToEdit] = useState<Habit>();
  const [habitToDelete, setHabitToDelete] = useState<Habit>();

  const [delta, setDelta] = useState<DeltaInfo | null>(null);

  const handleEditHabitSave = useCallback( async (formData: CreateHabitModalOnSaveProps) => {
    if (!habitToEdit) return;

    const oldParentId = habitToEdit.parent_habit_id;
    const newParentId = formData.parent_habit_id;

    // Update the habit
    await updateHabit({
      _id: habitToEdit._id,
      name: formData.name,
      recurrence_type: formData.frequency,
      recurrence_details: {
        rule: formData.rrule,
      },
      parent_habit_id: newParentId || undefined,
      rule_engine_enabled: formData.rule_engine_enabled,
      rule_engine_details: formData.rule_engine_details,
      habit_deltas_attributes: [
        ...(habitToEdit?.habit_deltas?.map((item) => ({
          id: item?._id,
          name: item.name,
          type: item.type,
          enabled: true,
          _destroy: false,
        })) || []),
        ...(delta?.newDeltas?.map((item) => ({
          name: item.name,
          type: item.type,
          enabled: true,
          _destroy: false,
        })) || []),
      ],
    });

    // Handle parent changes for rule engine
    const parentChanged = oldParentId !== newParentId;

    if (parentChanged) {
      // Helper to get rule engine habit IDs from a habit
      const getRuleEngineIds = (habit: Habit): string[] => {
        const logic = habit.rule_engine_details?.logic;
        if (!logic) return [];
        return logic.type === 'or' ? (logic as HabitRuleLogicOr).or : (logic as HabitRuleLogicAnd).and;
      };

      // Remove from old parent's rule engine
      if (oldParentId) {
        const oldParent = data?.find(h => h._id === oldParentId);
        if (oldParent) {
          const logicType = oldParent.rule_engine_details?.logic?.type || 'and';
          const currentIds = getRuleEngineIds(oldParent);
          const updatedIds = currentIds.filter((id: string) => id !== habitToEdit._id);

          await updateHabit({
            _id: oldParent._id,
            rule_engine_enabled: updatedIds.length > 0,
            rule_engine_details: {
              logic: {
                type: logicType,
                [logicType]: updatedIds,
              },
            },
          });
        }
      }

      // Add to new parent's rule engine
      if (newParentId) {
        const newParent = data?.find(h => h._id === newParentId);
        if (newParent) {
          const logicType = newParent.rule_engine_details?.logic?.type || 'and';
          const currentIds = getRuleEngineIds(newParent);
          const updatedIds = [...currentIds, habitToEdit._id];

          await updateHabit({
            _id: newParent._id,
            rule_engine_enabled: true,
            rule_engine_details: {
              logic: {
                type: logicType,
                [logicType]: updatedIds,
              },
            },
          });
        }
      }
    }

    toast.success("Hábito atualizado com sucesso!");

    setDelta(null);
    setHabitToEdit(undefined);
  }, [habitToEdit, updateHabit, delta, data]);


  // const handlePauseHabit = useCallback( async (data: { pause: boolean }) => {
  //   if (!habitToEdit) return;
  //
  //   try {
  //     await updateHabit({
  //       _id: habitToEdit._id,
  //       paused: data.pause,
  //     });
  //
  //     toast.success("Hábito pausado com sucesso!");
  //
  //     setHabitToEdit(undefined);
  //   } catch (error) {
  //     toast.error("Erro ao pausar hábito!");
  //   }
  // }, [updateHabit, habitToEdit]);
  //
  // const handleFinishHabit = useCallback(async () => {
  //   if (!habitToEdit) return;
  //
  //   try {
  //     await updateHabit({
  //       _id: habitToEdit._id,
  //       finished: true,
  //     });
  //
  //     toast.success("Hábito finalizado com sucesso!");
  //
  //     setHabitToEdit(undefined);
  //   } catch (error) {
  //     toast.error("Erro ao finalizar hábito!");
  //   }
  // }, [updateHabit, habitToEdit]);

  const onCreateHabit = async (params: CreateHabitModalOnSaveProps) => {
    try {
      const createdHabits = await createHabit({
        name: params.name,
        start_date: params.start_date,
        end_date: params.end_date,
        infinite: !!params.infinite,
        recurrence_details: {
          rule: params.rrule,
        },
        habit_category_id: params.category || undefined,
        habit_deltas:
          delta?.newDeltas?.map((item) => ({
            name: item.name,
            type: item.type,
          })) || [],
        rule_engine_enabled: false,
        children_habit_ids: params.children_habit_ids,
        parent_habit_id: params.parent_habit_id || undefined,
      });

      // If parent_habit_id is set, add this habit to parent's rule_engine_habit_ids
      if (params.parent_habit_id && createdHabits.length > 0) {
        const newHabitId = createdHabits[0]._id;
        const parentHabit = data?.find(h => h._id === params.parent_habit_id);

        if (parentHabit) {
          const logic = parentHabit.rule_engine_details?.logic;
          const currentRuleEngineHabitIds = logic
            ? (logic.type === 'or' ? (logic as HabitRuleLogicOr).or : (logic as HabitRuleLogicAnd).and)
            : [];

          const newRuleEngineHabitIds = [...currentRuleEngineHabitIds, newHabitId];
          const logicType = logic?.type || 'and';

          await updateHabit({
            _id: parentHabit._id,
            rule_engine_enabled: true,
            rule_engine_details: {
              logic: {
                type: logicType,
                [logicType]: newRuleEngineHabitIds,
              },
            },
          });
        }
      }

      toast.success("Hábito criado com sucesso!");

      setDelta(null);
      setCreateModalOpen(false);
      setHabitToEdit(undefined);
    } catch (error) {
      toast.error("Erro ao criar hábito!");
    }
  };

  const confirmDeletion = () => {
    mutate(habitToDelete?._id as string);
    setHabitToDelete(undefined);
  }

  return {
    data: data || [],
    loading,
    error,
    
    createModalOpen,
    setCreateModalOpen,

    create: onCreateHabit,
    edit: handleEditHabitSave,

    editModalOpen: !!habitToEdit,
    setEditModalOpen: setHabitToEdit,
    habitToEdit,

    deleteModalOpen: !!habitToDelete,
    habitToDelete,
    setDeleteModalOpen: setHabitToDelete,
    confirmDeletion: confirmDeletion,

    // handlePauseHabit,
    // handleFinishHabit,

    delta,
    setDelta
  }
} 
