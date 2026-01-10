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

  const handleEditHabitSave = useCallback( (data: CreateHabitModalOnSaveProps) => {
    if (!habitToEdit) return;

    updateHabit({
      _id: habitToEdit._id,
      name: data.name,
      recurrence_type: data.frequency,
      recurrence_details: {
        rule: data.rrule,
      },
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

    toast.success("Hábito atualizado com sucesso!");

    setDelta(null);
    setHabitToEdit(undefined);
  }, [habitToEdit, updateHabit, delta]);


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
      await createHabit({
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
      });

      toast.success("Hábito criado com sucesso!");

      setDelta(null);
      setCreateModalOpen(false);
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
