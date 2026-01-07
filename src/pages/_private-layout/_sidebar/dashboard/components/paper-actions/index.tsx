import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BoxesExplanation } from "@/features/habits/components/atoms/boxes-explanation";
import {
  Book,
  BookOpen,
  CirclePlus,
  PackagePlus,
  PencilOff,
  PencilRuler,
} from "lucide-react";

interface DashboardPaperActionsProps {
  editEnabled: boolean;
  onClickAddHabit: () => void;
  onClickEditEnabled: () => void;
  onClickAddCategory: () => void;
}

export const DashboardPaperActions: React.FC<DashboardPaperActionsProps> = ({
  editEnabled,
  onClickAddHabit,
  onClickEditEnabled,
  onClickAddCategory,
}) => {
  const [hideExplanation, setHideExplanation] = useState(true);

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-neutral-300 p-4 pr-8 relative",
        hideExplanation && "border-b-0 p-0 pr-0",
      )}
    >
      <div className="absolute top-0 right-0 border-l border-b border-neutral-300 rounded-bl-md flex items-center divide-x divide-neutral-300">
        <button
          className={cn(
            "h-6 w-5 flex items-center justify-center",
            "hover:bg-black hover:text-white duration-200 transition-colors",
          )}
          onClick={() => setHideExplanation(!hideExplanation)}
        >
          {hideExplanation ? (
            <Book size={14} className="-translate-y-px translate-x-px" />
          ) : (
            <BookOpen size={14} className="-translate-y-px translate-x-px" />
          )}
        </button>

        <button
          className={cn(
            "h-6 w-6 flex items-center justify-center",
            "hover:bg-black hover:text-white duration-200 transition-colors",
          )}
          onClick={onClickEditEnabled}
        >
          {editEnabled ? (
            <PencilOff size={12} className="-translate-y-px translate-x-px" />
          ) : (
            <PencilRuler size={14} className="-translate-y-px translate-x-px" />
          )}
        </button>

        <button
          className={cn(
            "h-6 w-6 flex items-center justify-center",
            "hover:bg-black hover:text-white duration-200 transition-colors",
          )}
          onClick={onClickAddCategory}
        >
          <PackagePlus size={14} className="-translate-y-px translate-x-px" />
        </button>

        <button
          className={cn(
            "h-6 w-6 flex items-center justify-center",
            "hover:bg-black hover:text-white duration-200 transition-colors",
          )}
          onClick={onClickAddHabit}
        >
          <CirclePlus size={14} className="-translate-y-px translate-x-px" />
        </button>
      </div>

      {!hideExplanation && <BoxesExplanation />}
    </div>
  );
};
