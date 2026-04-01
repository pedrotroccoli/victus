import { useDroppable } from "@dnd-kit/core";
import { IconDisplay } from "@/components/atoms/icon-picker";
import { Button } from "@/components/ions/button";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Coffee,
  Book,
  Heart,
  Star,
  Moon,
  Plus,
  Trash2,
  Folder,
  ArrowDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface HabitEmptyBoxProps {
  category?: HabitCategory;
  onAddHabit?: () => void;
  onDeleteCategory?: () => void;
}

const floatingIcons = [
  { Icon: Dumbbell, position: "top-1 left-[18%]", size: 10 },
  { Icon: Coffee, position: "top-3 right-[22%]", size: 11 },
  { Icon: Book, position: "top-[45%] left-[8%]", size: 10 },
  { Icon: Heart, position: "top-[40%] right-[10%]", size: 12 },
  { Icon: Star, position: "bottom-[38%] left-[15%]", size: 11 },
  { Icon: Moon, position: "bottom-3 right-[18%]", size: 10 },
];

export const HabitEmptyBox = ({ category, onAddHabit, onDeleteCategory }: HabitEmptyBoxProps) => {
  const { t } = useTranslation("habit");

  const { setNodeRef, isOver } = useDroppable({
    id: category?._id || '',
    data: {
      type: 'empty-box',
      category
    }
  });

  return (
    <div ref={setNodeRef}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full py-6 px-4 rounded-md border bg-gradient-to-b from-neutral-50/50 to-white overflow-hidden transition-all",
          isOver
            ? "border-solid border-black bg-neutral-100"
            : "border-dashed border-neutral-300 hover:border-neutral-400"
        )}
      >
        {/* Concentric circles */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity",
          isOver && "opacity-30"
        )}>
          <div className="absolute w-[160px] h-[160px] rounded-full border border-neutral-200/50" />
          <div className="absolute w-[110px] h-[110px] rounded-full border border-neutral-200/70" />
          <div className="absolute w-[60px] h-[60px] rounded-full border border-neutral-200/50" />
        </div>

        {/* Floating icons */}
        <div className={cn(
          "absolute inset-0 pointer-events-none transition-opacity",
          isOver && "opacity-0"
        )}>
          {floatingIcons.map(({ Icon, position, size }, index) => (
            <div
              key={index}
              className={`absolute ${position} text-neutral-300`}
              style={{
                animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <Icon size={size} strokeWidth={1.5} />
            </div>
          ))}
        </div>

        {/* Central icon */}
        <div className={cn(
          "relative z-10 flex items-center justify-center w-10 h-10 rounded-lg bg-white border shadow-sm mb-2 transition-colors",
          isOver ? "border-black" : "border-neutral-200"
        )}>
          {isOver ? (
            <ArrowDown size={18} strokeWidth={1.5} className="text-black animate-bounce" />
          ) : category?.icon ? (
            <IconDisplay name={category.icon} size={18} className="text-neutral-700" />
          ) : (
            <Folder size={18} strokeWidth={1.5} className="text-neutral-400" />
          )}
        </div>

        {/* Text content */}
        <h4 className="relative z-10 text-sm font-medium text-neutral-900 mb-0.5">
          {isOver
            ? t("empty_category.drop_title", "Drop here")
            : t("empty_category.title", "No habits yet")
          }
        </h4>
        <p className={cn(
          "relative z-10 text-xs text-neutral-500 text-center max-w-[240px] transition-all",
          isOver ? "mb-0" : "mb-3"
        )}>
          {isOver
            ? t("empty_category.drop_description", "Release to move the habit to this category")
            : t("empty_category.description", "Add a habit or drag one here to get started.")
          }
        </p>

        {/* Action buttons - hidden when dragging over */}
        {!isOver && (
          <div className="relative z-10 flex items-center gap-2">
            {onDeleteCategory && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs border-neutral-300 hover:bg-neutral-100"
                onClick={onDeleteCategory}
                iconLeft={Trash2}
              >
                {t("empty_category.delete_button", "Delete")}
              </Button>
            )}
            {onAddHabit && (
              <Button
                variant="default"
                size="sm"
                className="h-7 px-2.5 text-xs bg-black text-white hover:bg-black/90"
                onClick={onAddHabit}
                iconLeft={Plus}
              >
                {t("empty_category.add_button", "Add habit")}
              </Button>
            )}
          </div>
        )}

        {/* CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </div>
  )
}