import { Expense, Category, Insight } from '../types';

export const generateInsights = (
  expenses: Expense[],
  totalSpent: number,
  budgetLimit: number,
  categoryTotals: Record<string, number>
): Insight[] => {
  const insights: Insight[] = [];

  // Food spending > 30% of total
  const foodSpending = categoryTotals['Food'] || 0;
  if (totalSpent > 0 && (foodSpending / totalSpent) > 0.3) {
    insights.push({
      type: 'warning',
      message: 'You are spending heavily on food. Consider reducing outside meals.'
    });
  }

  // Comparison Insight
  const travelSpending = categoryTotals['Travel'] || 0;
  const avgStudentTravel = 1500; // Mock average
  if (travelSpending > avgStudentTravel) {
    const diff = Math.round(((travelSpending - avgStudentTravel) / avgStudentTravel) * 100);
    insights.push({
      type: 'info',
      message: `You spend ${diff}% more on travel compared to average students. Try carpooling!`
    });
  }

  // Subscriptions > ₹1500
  const subscriptionSpending = categoryTotals['Subscriptions'] || 0;
  if (subscriptionSpending > 1500) {
    insights.push({
      type: 'info',
      message: 'You may have unused subscriptions. Review and cancel unnecessary ones.'
    });
  }

  // Total spending > 80% of budget
  if (budgetLimit > 0) {
    const percentage = (totalSpent / budgetLimit) * 100;
    if (percentage > 100) {
      insights.push({
        type: 'alert',
        message: 'Alert: Budget exceeded. Reduce non-essential expenses immediately.'
      });
    } else if (percentage > 80) {
      insights.push({
        type: 'warning',
        message: 'Warning: You are close to exceeding your monthly budget.'
      });
    }
  }

  return insights;
};

export const calculateDisciplineScore = (
  expenses: Expense[],
  totalSpent: number,
  budgetLimit: number,
  categoryTotals: Record<string, number>
): number => {
  if (budgetLimit === 0) return 0;
  
  let score = 70; // Base score

  // 1. Under budget logic
  const percentageUsed = (totalSpent / budgetLimit) * 100;
  if (percentageUsed <= 80) score += 15;
  else if (percentageUsed <= 100) score += 5;
  else score -= 20;

  // 2. No single category > 50%
  const hasConcentratedSpending = Object.values(categoryTotals).some(
    amt => (amt / totalSpent) > 0.5
  );
  if (totalSpent > 0 && !hasConcentratedSpending) score += 10;
  else if (totalSpent > 0) score -= 10;

  // 3. Spending distribution (variety of categories indicates better tracking)
  const categoryCount = Object.keys(categoryTotals).length;
  if (categoryCount >= 4) score += 5;

  return Math.max(0, Math.min(100, score));
};

export const calculateStreak = (expenses: Expense[], dailyBudget: number): number => {
  if (expenses.length === 0 || dailyBudget === 0) return 0;

  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, e) => {
    const date = new Date(e.date).toDateString();
    acc[date] = (acc[date] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();
    
    const daySpent = expensesByDate[dateStr] || 0;
    if (daySpent <= dailyBudget && daySpent > 0) {
      streak++;
    } else if (i === 0 && daySpent === 0) {
      // If no spending yet today, don't break streak but don't increment
      continue;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateProjection = (expenses: Expense[]): number => {
  if (expenses.length === 0) return 0;

  // Get unique days in the current month that have expenses
  const dates = expenses.map(e => new Date(e.date).toDateString());
  const uniqueDays = new Set(dates).size;
  
  if (uniqueDays === 0) return 0;
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDaily = totalSpent / uniqueDays;
  
  return Math.round(avgDaily * 30);
};
