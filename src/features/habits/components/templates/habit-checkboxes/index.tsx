import { isAcceptedByRRule, isInfiniteHabit } from "@/utils/habits";
import { groupByCategory } from "../habit-lines/utils";
import { format, isAfter, isBefore } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface HabitCheckboxes {
  habits: Habit[];
  habitCategories: HabitCategory[];
  currentDay: Date;
  habitsCheckedHash: Record<string, Record<string, HabitCheck>>;
  onCheckHabit?: (habit: Habit) => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habit: Habit) => void;
  editEnabled?: boolean;
}

export const HabitCheckboxes = ({
  habits,
  habitCategories,
  currentDay,
  habitsCheckedHash,
  onCheckHabit,
  editEnabled,
  onEditHabit,
  onDeleteHabit,
}: HabitCheckboxes) => {
  const getHabitCheck = (habit: Habit, formattedDay: string) => {
    return habitsCheckedHash?.[habit._id]?.[formattedDay];
  };

  return (
    <div className="grid gap-6">
      {Object.entries(groupByCategory(habits, habitCategories || []))
        .filter(([_, category]) => category?.list?.length > 0)
        .map(([id, category]) => {
          return (
            <div key={id}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[2px] h-6 bg-black"></div>
                <h4 className="font-[Recursive] font-medium">
                  {category?.category?.name}
                </h4>
              </div>
              <ul className="grid gap-2">
                {category.list
                  .filter((habit) => {
                    const isAccepted = isAcceptedByRRule(
                      habit,
                      format(currentDay, "MM/dd/yyyy"),
                    );
                    const startsBeforeCurrentDay = isBefore(
                      habit.start_date,
                      currentDay,
                    );
                    const endsAfterCurrentDay = isInfiniteHabit(habit)
                      ? true
                      : isAfter(habit.end_date, currentDay);

                    if (
                      isAccepted &&
                      startsBeforeCurrentDay &&
                      endsAfterCurrentDay
                    )
                      return true;

                    return false;
                  })
                  .map((habit) => {
                    const checked =
                      getHabitCheck(habit, format(currentDay, "MM/dd/yyyy"))
                        ?.checked || false;

                    return (
                      <li key={habit._id} className="flex gap-4">
                        <button
                          className="flex items-center gap-4"
                          onClick={() => onCheckHabit?.(habit)}
                        >
                          <label className="flex items-center gap-4">
                            <Checkbox className="w-5 h-5" checked={checked} />
                            <p
                              className={cn(
                                "font-medium text-left truncate text-ellipsis",
                                checked && "text-black/50 line-through",
                              )}
                            >
                              {habit.name}
                            </p>
                          </label>
                        </button>
                        {editEnabled && (
                          <div className="flex items-center gap-2">
                            <button
                              className="flex items-center justify-center w-6 h-6 border border-neutral-300 rounded-full"
                              onClick={() => onEditHabit?.(habit)}
                            >
                              <Pencil size={12} className="text-neutral-500" />
                            </button>
                            <button
                              className="flex items-center justify-center w-6 h-6 border border-neutral-300 rounded-full"
                              onClick={() => onDeleteHabit?.(habit)}
                            >
                              <Trash size={12} className="text-neutral-500" />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
    </div>
  );
};
