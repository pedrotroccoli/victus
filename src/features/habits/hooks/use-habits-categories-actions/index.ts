import { useCreateHabitCategory, useHabitCategories } from "@/services/habit-category/hooks";
import { useCallback, useState } from "react";
import { CreateCategoryForm } from "../../components/templates/create-category-modal";
import { toast } from "sonner";

export interface UseHabitsCategoryActions {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  create: (data: CreateCategoryForm) => Promise<void>;
  data: HabitCategory[];
  loading: boolean;
  error: unknown;
}

export const useHabitsCategoryActions = (): UseHabitsCategoryActions => {
  const [modalOpen, setModalOpen] = useState(false);

  const { mutateAsync: createHabitCategory } = useCreateHabitCategory();
  const { data: categories, isLoading: loading, error } =
    useHabitCategories();

  const create = useCallback(async (data: CreateCategoryForm) => {
    try {
      let highestOrder =
        Number(
          categories?.sort((a, b) => a.order - b.order).pop()?.order,
        ) || 1000;

      highestOrder += 1000;
      highestOrder = Number(highestOrder.toFixed(0));

      await createHabitCategory({
        name: data.name,
        order: highestOrder,
      });

      setModalOpen(false);
    } catch (error) {
      toast.error("Erro ao criar categoria!");
    }
  }, [createHabitCategory, categories]);

  return {
    modalOpen,
    setModalOpen,
    create,
    data: categories || [],
    loading,
    error
  }
}
