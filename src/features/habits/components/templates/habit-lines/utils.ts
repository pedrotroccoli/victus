export interface HabitGroup {
  list: Habit[];
  categoryId: string;
  category?: HabitCategory;
}

export type CategorizedHabits = Record<string, HabitGroup>;

export const groupByCategory = (habits: Habit[], categories: HabitCategory[]): CategorizedHabits => {
  const grouped = habits.reduce((acc: CategorizedHabits, habit: Habit) => {
    if (!acc[habit.habit_category_id] && habit.habit_category_id) {
      acc[habit.habit_category_id] = {
        categoryId: habit.habit_category_id,
        category: habit.habit_category,
        list: []
      };
    }

    if (!acc['general']) {
      acc['general'] = {
        categoryId: 'general',
        category: {
          _id: 'general',
          name: 'Geral',
        } as HabitCategory,
        list: []
      };
    }

    if (habit.habit_category_id) {
      acc[habit.habit_category_id].list.push(habit);
    } else {
      acc['general'].list.push(habit);
    }

    return acc;
  }, {});

  const withEmptyCategories = categories.map(item => {
    return grouped[item._id] || {
      categoryId: item._id,
      category: item,
      list: []
    }
  })

  withEmptyCategories.unshift(grouped['general'])

  const all = withEmptyCategories.reduce((acc: CategorizedHabits, item: HabitGroup) => {
    acc[item.categoryId] = item;
    return acc;
  }, {});

  return all;
}