import { MoodValue } from "@/services/mood/types";
import { MoodEmoji } from "../../atoms/mood-emoji";
import { moodConfig } from "@/features/mood/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface MoodDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMood: MoodValue | null;
  onSave: (description: string) => Promise<void>;
  isLoading?: boolean;
}

export const MoodDescriptionModal = ({
  open,
  onOpenChange,
  selectedMood,
  onSave,
  isLoading = false,
}: MoodDescriptionModalProps) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const [description, setDescription] = useState("");

  if (!selectedMood) return null;

  const config = moodConfig[selectedMood];

  const handleSave = async () => {
    await onSave(description);
    setDescription("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{t("mood.add_description")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className={cn("p-4 rounded-full", config.bgColor)}>
            <MoodEmoji value={selectedMood} size="lg" />
          </div>
          <span className={cn("text-sm font-medium", config.color)}>
            {t(`mood.values.${selectedMood}`)}
          </span>
        </div>

        <div className="space-y-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("mood.description_placeholder")}
            className="min-h-[100px] resize-none"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t("mood.skip")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !description.trim()}
            className="bg-black text-white hover:bg-black/90"
          >
            {isLoading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              tCommon("save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
