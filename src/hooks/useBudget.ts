'use client';

import { useState, useEffect } from 'react';
import { Expense, Category, Budget } from '../types';
import { calculateDisciplineScore, calculateStreak } from '../lib/insights';

export const useBudget = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget>({ monthlyLimit: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) setBudget(JSON.parse(savedBudget));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('budget', JSON.stringify(budget));
    }
  }, [budget, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Math.random().toString(36).substring(2, 11) };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateBudget = (limit: number) => {
    setBudget({ monthlyLimit: limit });
  };

  const clearAllData = () => {
    setExpenses([]);
    setBudget({ monthlyLimit: 0 });
    localStorage.removeItem('expenses');
    localStorage.removeItem('budget');
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, budget.monthlyLimit - totalSpent);
  const percentageUsed = budget.monthlyLimit > 0 ? (totalSpent / budget.monthlyLimit) * 100 : 0;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<Category, number>);

  const disciplineScore = calculateDisciplineScore(
    expenses,
    totalSpent,
    budget.monthlyLimit,
    categoryTotals
  );

  const dailyBudget = budget.monthlyLimit / 30;
  const streak = calculateStreak(expenses, dailyBudget);

  return {
    expenses,
    budget,
    addExpense,
    deleteExpense,
    updateBudget,
    clearAllData,
    totalSpent,
    remainingBudget,
    percentageUsed,
    categoryTotals,
    disciplineScore,
    streak,
    isLoaded
  };
};
