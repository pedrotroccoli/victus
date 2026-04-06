import { useCreateHabitCategory, useDeleteHabitCategory, useHabitCategories, useUpdateHabitCategory } from "@/services/habit-category/hooks";
import { useCallback, useState } from "react";
import { CreateCategoryForm } from "../../components/templates/create-category-modal";
import { toast } from "sonner";

export interface UseHabitsCategoryActions {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  editingCategory: HabitCategory | undefined;
  setEditingCategory: (category: HabitCategory | undefined) => void;
  create: (data: CreateCategoryForm) => Promise<void>;
  update: (data: CreateCategoryForm) => Promise<void>;
  remove: (id: string) => Promise<void>;
  data: HabitCategory[];
  loading: boolean;
  error: unknown;
}

export const useHabitsCategoryActions = (): UseHabitsCategoryActions => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HabitCategory | undefined>(undefined);

  const { mutateAsync: createHabitCategory } = useCreateHabitCategory();
  const { mutateAsync: updateHabitCategory } = useUpdateHabitCategory();
  const { mutateAsync: deleteHabitCategory } = useDeleteHabitCategory();
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
        icon: data.icon,
      });

      setModalOpen(false);
    } catch {
      toast.error("Erro ao criar categoria!");
    }
  }, [createHabitCategory, categories]);

  const update = useCallback(async (data: CreateCategoryForm) => {
    if (!editingCategory) return;

    try {
      await updateHabitCategory({
        id: editingCategory._id,
        name: data.name,
        icon: data.icon,
      });

      setEditingCategory(undefined);
      setModalOpen(false);
      toast.success("Categoria atualizada!");
    } catch {
      toast.error("Erro ao atualizar categoria!");
    }
  }, [updateHabitCategory, editingCategory]);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteHabitCategory(id);
      toast.success("Categoria removida!");
    } catch {
      toast.error("Erro ao remover categoria!");
    }
  }, [deleteHabitCategory]);

  return {
    modalOpen,
    setModalOpen,
    editingCategory,
    setEditingCategory,
    create,
    update,
    remove,
    data: categories || [],
    loading,
    error
  }
}
