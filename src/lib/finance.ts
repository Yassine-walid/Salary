import { addDays, addMonths } from 'date-fns';

export const nextDate = (current: Date, frequency: 'weekly'|'biweekly'|'monthly'|'one_time') => {
  if (frequency === 'weekly') return addDays(current, 7);
  if (frequency === 'biweekly') return addDays(current, 14);
  if (frequency === 'monthly') return addMonths(current, 1);
  return addDays(current, 36500);
};

export const budgetProgress = (budget: number, spent: number, threshold: number) => {
  const percent = budget === 0 ? 0 : (spent / budget) * 100;
  return { percent, thresholdExceeded: percent >= threshold, overSpent: spent > budget };
};
