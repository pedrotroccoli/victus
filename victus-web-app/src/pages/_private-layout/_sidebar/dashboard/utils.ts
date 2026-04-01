import { format } from "date-fns";

export const generateHabitsHash = (checks: HabitCheck[]) => {
  if (!checks) return {};

return checks.reduce(
      (
        previous: Record<string, Record<string, HabitCheck>>,
        current: HabitCheck,
      ) => {
        if (!current.created_at) return previous;

        return {
          ...previous,
          [current.habit_id]: {
            ...(previous[current.habit_id] || {}),
            [format(current.created_at, "MM/dd/yyyy")]: current,
          },
        };
      },
      {},
    )
}
