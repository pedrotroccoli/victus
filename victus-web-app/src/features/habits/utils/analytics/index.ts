import { isAcceptedByRRule } from "@/utils/habits";
import { format, isAfter, isBefore } from "date-fns";

interface HabitsCheckedHash {
  [key: string]: {
    [key: string]: {
      checked: boolean;
    };
  };
}

export interface HabitsAnalytics {
  date: string;
  total: number;
  alreadyChecked: number;
  percentage: number;
}

export const getHabitsAnalytics = (habits: Habit[], habitsCheckedHash: HabitsCheckedHash) => {
  const getAnalyticsFromDate = (date: Date): HabitsAnalytics => {
    const dayHabits = habits?.filter((item: Habit) => {
      const isAccepted = isAcceptedByRRule(item, format(date, 'MM/dd/yyyy'));

      if (!isAccepted) return false;

      if (isBefore(item.start_date, date)) return true;

      if (item?.end_date && isAfter(item.end_date, date)) return true;

      return false;
    });

    const dayFormatted = format(date, 'MM/dd');

    const alreadyChecked = dayHabits?.filter(item => habitsCheckedHash?.[item._id]?.[dayFormatted]?.checked || false);

    return ({
      date: dayFormatted,
      total: dayHabits?.length,
      alreadyChecked: alreadyChecked?.length,
      percentage: Number((((alreadyChecked?.length || 0) / (dayHabits?.length || 1)) * 100).toFixed(0))
    })
  };
  return {
    getAnalyticsFromDate
  }
}