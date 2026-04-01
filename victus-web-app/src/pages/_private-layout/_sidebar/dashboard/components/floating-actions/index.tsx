import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CirclePlus,
  PackagePlus,
  PencilOff,
  PencilRuler,
} from "lucide-react";
import { useDashboard } from "../../providers/dashboard-provider";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface FloatingActionsProps {
  editEnabled: boolean;
  onClickAddHabit: () => void;
  onClickEditEnabled: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  editEnabled,
  onClickAddHabit,
  onClickEditEnabled,
}) => {
  const { t } = useTranslation("dashboard");
  const { categories } = useDashboard();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const addNewCategory = () => {
    categories.setModalOpen(true);
  };

  const actions = [
    {
      icon: editEnabled ? PencilOff : PencilRuler,
      onClick: onClickEditEnabled,
      label: editEnabled ? t("floating_actions.disable_edit") : t("floating_actions.enable_edit"),
    },
    {
      icon: PackagePlus,
      onClick: addNewCategory,
      label: t("floating_actions.new_category"),
    },
    {
      icon: CirclePlus,
      onClick: onClickAddHabit,
      label: t("floating_actions.new_habit"),
    },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isHovered = hoveredIndex === index;

        return (
          <div key={index} className="w-10 h-10 relative flex items-center justify-center">
            <motion.button
              className={cn(
                "absolute bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-md transition-colors",
                isHovered ? "bg-black text-white" : "hover:bg-neutral-50"
              )}
              animate={{
                width: isHovered ? 48 : 40,
                height: isHovered ? 48 : 40,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={action.onClick}
            >
              <Icon size={isHovered ? 20 : 16} />
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded"
                >
                  {action.label}
                </motion.span>
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
