import { useTranslation } from "react-i18next";
import { MoodSelector } from "@/features/mood/components/templates/mood-selector";
import { MoodDescriptionModal } from "@/features/mood/components/templates/mood-description-modal";
import { useMoodActions } from "@/features/mood/hooks/use-mood-actions";
import { LoaderCircle, X } from "lucide-react";
import { MoodValue } from "@/services/mood/types";

interface MoodSectionProps {
  onClose?: () => void;
}

export const MoodSection = ({ onClose }: MoodSectionProps) => {
  const { t } = useTranslation("dashboard");

  const {
    loading,
    currentHourMood,
    descriptionModalOpen,
    setDescriptionModalOpen,
    selectedMoodValue,
    selectMood,
    addDescription,
    isUpdating,
  } = useMoodActions();

  const handleSelectMood = (value: MoodValue) => {
    selectMood(value);
    onClose?.();
  };

  if (loading) {
    return (
      <div className="mb-6 p-4 border border-neutral-200 rounded-lg bg-white">
        <div className="flex items-center justify-center py-8">
          <LoaderCircle size={24} className="animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 p-4 pr-7 border border-neutral-200 rounded-lg bg-white relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-neutral-600"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold font-[Recursive] text-neutral-700">
            {t("mood.title")}
          </h3>

          <MoodSelector
            selectedMood={currentHourMood?.value}
            onSelectMood={handleSelectMood}
          />
        </div>
      </div>

      <MoodDescriptionModal
        open={descriptionModalOpen}
        onOpenChange={setDescriptionModalOpen}
        selectedMood={selectedMoodValue}
        onSave={addDescription}
        isLoading={isUpdating}
      />
    </>
  );
};
