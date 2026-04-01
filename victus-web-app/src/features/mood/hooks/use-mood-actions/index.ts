import { useCallback, useMemo, useState } from "react";
import { useGetMoods, useCreateMood, useUpdateMood, useDeleteMood } from "@/services/mood";
import { Mood, MoodValue } from "@/services/mood/types";
import { getCurrentHourBlock, getTodayDate } from "@/features/mood/utils";

export interface UseMoodActions {
  // Data
  moods: Mood[];
  loading: boolean;
  error: unknown;

  // Current hour mood
  currentHourMood: Mood | null;
  canCreateMood: boolean;

  // Modal state
  descriptionModalOpen: boolean;
  setDescriptionModalOpen: (open: boolean) => void;
  selectedMoodValue: MoodValue | null;

  // Actions
  selectMood: (value: MoodValue) => Promise<void>;
  addDescription: (description: string) => Promise<void>;
  updateCurrentMood: (value: MoodValue, description: string) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
}

export const useMoodActions = (): UseMoodActions => {
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [selectedMoodValue, setSelectedMoodValue] = useState<MoodValue | null>(null);

  const { data: moods = [], isLoading, error } = useGetMoods();
  const { mutateAsync: createMoodMutation, isPending: isCreating } = useCreateMood();
  const { mutateAsync: updateMoodMutation, isPending: isUpdating } = useUpdateMood();
  const { mutateAsync: deleteMoodMutation } = useDeleteMood();

  const currentHourMood = useMemo(() => {
    const currentHour = getCurrentHourBlock();
    const today = getTodayDate();

    return moods.find(
      (mood) => mood.hour_block === currentHour && mood.date === today
    ) || null;
  }, [moods]);

  const canCreateMood = !currentHourMood;

  const selectMood = useCallback(async (value: MoodValue) => {
    setSelectedMoodValue(value);

    if (currentHourMood) {
      // Update existing mood
      await updateMoodMutation({
        id: currentHourMood._id,
        params: {
          mood: {
            value,
          },
        },
      });
    } else {
      // Create new mood
      await createMoodMutation({
        mood: {
          value,
          description: "",
        },
      });
      // Open modal for optional description only on create
      setDescriptionModalOpen(true);
    }
  }, [createMoodMutation, currentHourMood, updateMoodMutation]);

  const addDescription = useCallback(async (description: string) => {
    if (!currentHourMood) return;

    await updateMoodMutation({
      id: currentHourMood._id,
      params: {
        mood: {
          description,
        },
      },
    });

    setSelectedMoodValue(null);
    setDescriptionModalOpen(false);
  }, [currentHourMood, updateMoodMutation]);

  const updateCurrentMood = useCallback(async (value: MoodValue, description: string) => {
    if (!currentHourMood) return;

    await updateMoodMutation({
      id: currentHourMood._id,
      params: {
        mood: {
          value,
          description,
        },
      },
    });
  }, [currentHourMood, updateMoodMutation]);

  const deleteMood = useCallback(async (id: string) => {
    await deleteMoodMutation(id);
  }, [deleteMoodMutation]);

  return {
    moods,
    loading: isLoading,
    error,
    currentHourMood,
    canCreateMood,
    descriptionModalOpen,
    setDescriptionModalOpen,
    selectedMoodValue,
    selectMood,
    addDescription,
    updateCurrentMood,
    deleteMood,
    isCreating,
    isUpdating,
  };
};
