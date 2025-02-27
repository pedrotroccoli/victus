export interface HabitGroup {
  list: Habit[];
  name: string;
  _id: string;

}

export const groupByCategory = (habits: Habit[], categories: HabitCategory[]): Record<string, HabitGroup> => {
  const grouped = habits.reduce((acc: Record<string, { name: string, list: Habit[], _id: string }>, habit: Habit) => {
    if (!acc[habit.habit_category_id] && habit.habit_category_id) {
      acc[habit.habit_category_id] = {
        name: habit?.habit_category?.name || '',
        _id: habit?.habit_category_id || '',
        list: []
      };
    }

    if (!acc['general']) {
      acc['general'] = {
        name: 'Geral',
        _id: 'general',
        list: []
      };
    }

    if (habit.habit_category_id) {
      acc[habit.habit_category_id].name = habit.habit_category.name || '';
      acc[habit.habit_category_id].list.push(habit);
    } else {
      acc['general'].list.push(habit);
    }

    return acc;
  }, {});


  const unusedCategories = categories.filter((category) => !grouped[category._id]);

  unusedCategories.forEach((category) => {
    grouped[category._id] = {
      name: category.name,
      _id: category._id,
      list: []
    };
  });

  return grouped;
}