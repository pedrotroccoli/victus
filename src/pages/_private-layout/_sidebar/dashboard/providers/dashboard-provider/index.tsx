import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useMemo } from "react";
import { Dialog } from "@/components/ui/dialog";
import { addDays, subDays } from "date-fns";
import { useMe } from "@/services/auth";
import { UseCheckActions, useHabitsCheckingActions } from "@/features/habits/hooks/use-habits-checks-actions";
import { UseHabitActions, useHabitsActions } from "@/features/habits/hooks/use-habits-actions";
import { UseHabitsCategoryActions, useHabitsCategoryActions } from "@/features/habits/hooks/use-habits-categories-actions";
import { CreateCategoryModal } from "@/features/habits/components/templates/create-category-modal";
import { CreateHabitModal } from "@/features/habits/components/templates/create-habit-modal";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { DeleteHabitModal } from "@/features/habits/components/templates/delete-habit-modal";
import { CreateDeltaModal } from "@/features/habits/components/templates/create-delta-modal";
import FillDeltaModal from '@/features/habits/components/templates/fill-delta-modal';

interface DashboardContext {
  generalLoading: boolean;

  categories: UseHabitsCategoryActions;

  habits: UseHabitActions;

  checks: UseCheckActions;
}

const DashboardContext = React.createContext({} as DashboardContext);

interface DashboardProviderProps {
  children: React.ReactNode;
}

export interface DeltaInfo {
  open?: boolean;
  habit?: Habit;
  deltaId?: string;
  type: "create" | "edit";
  newDeltas?: { name: string; type: "number" | "time"; _id: string }[];
}

// Fetch mais dias para cobrir qualquer tamanho de tela
// Máximo de dias visíveis: (760px / 28px) ≈ 27 dias
const startRange = subDays(new Date(), 20);
const endRange = addDays(new Date(), 10);

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { data: me, isLoading: isLoadingMe } = useMe();

  const habits = useHabitsActions({
    startRange,
    endRange,
    enabled: !!me,
  })

  const checks = useHabitsCheckingActions({
    startRange,
    endRange,
    enabled: !!me,
    habits: habits.data,
  });

  const categories = useHabitsCategoryActions();

  const generalLoading = useMemo(
    () =>
      isLoadingMe ||
      habits.loading ||
      checks.loading ||
      categories.loading,
    [
      isLoadingMe, 
      habits.loading,
      checks.loading,
      categories.loading
    ],
  );

  const value = useMemo((): DashboardContext => ({
    generalLoading,

    habits,
    categories,
    checks
  }), [
    generalLoading,
    categories, 
    habits,
    checks,
  ]);

  const habitModalInfo = useMemo(() => ({
    open: Boolean(habits.createModalOpen || habits.editModalOpen),
    onOpenChange: () => {
      if (habits.editModalOpen) {
        habits.setEditModalOpen(undefined);
        return
      }

      habits.setCreateModalOpen(false);
    }
  }), [habits])

  return ( 
    <DashboardContext.Provider value={value}>
      {children}

      <Dialog open={categories.modalOpen} onOpenChange={categories.setModalOpen}>
        <CreateCategoryModal onSave={categories.create} />
      </Dialog>

      <Dialog open={habitModalInfo.open} onOpenChange={habitModalInfo.onOpenChange}>
        <CreateHabitModal
          newDeltas={habits.delta?.newDeltas}
          onSave={(params) => {
            if (habits.editModalOpen) {
              habits.edit(params);
              return
            }

            habits.create(params);
          }}
          habit={habits.habitToEdit || undefined}
          habits={habits.data}
          categories={categories.data}
          onEditDelta={(deltaId: string) => {
            habits.setDelta({
              habit: habits.habitToEdit as Habit,
              deltaId,
              type: "edit",
              open: true,
            });
          }}
          onCreateDelta={() => {
            habits.setDelta(prev => ({
              ...prev,
              type: 'create',
              open: true
            }));
          }}
          onPause={() => {}}
          onFinish={() => {}}
        />
      </Dialog>
      
      <Dialog
        open={!!checks.fillDeltaModalOpen}
        onOpenChange={() => checks.setFillDeltaModalOpen(undefined)}
      >
        <FillDeltaModal
          habit={checks.habitToFillDelta}
          habitCheck={checks.habitCheckToFillDelta}
          onSave={checks.fillDelta}
        />
      </Dialog>


      <Dialog open={!!habits.delta?.open} onOpenChange={() => habits.setDelta(null)}>
        <CreateDeltaModal
          onSave={(newDelta) => {
            habits.setDelta({
              type: 'create',
              newDeltas: [...(habits.delta?.newDeltas || []), {
              ...newDelta,
              _id: uuidv4()
              }]
            })
          }}
          habit={habits.habitToEdit || undefined}
          deltaId={habits.delta?.deltaId}
        />
      </Dialog>


      <AlertDialog
        open={habits.deleteModalOpen}
        onOpenChange={() => habits.setDeleteModalOpen(undefined)}
      >
        <DeleteHabitModal
          habit={habits.habitToDelete || undefined}
          onConfirm={habits.confirmDeletion}
          onCancel={() => habits.setDeleteModalOpen(undefined)}
        />
      </AlertDialog>
   </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContext => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
} 
