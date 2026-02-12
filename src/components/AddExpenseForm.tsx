'use client';

import React, { useState } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { toast } from 'react-hot-toast';
import { IndianRupee, Plus, Target, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

export const AddExpenseForm = () => {
  const { addExpense, updateBudget, budget } = useBudget();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [newBudget, setNewBudget] = useState(budget.monthlyLimit.toString());

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: Number(amount),
      category,
      date,
      notes
    });

    toast.success('Expense added successfully! 🎉');
    setAmount('');
    setNotes('');
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(newBudget))) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    updateBudget(Number(newBudget));
    toast.success('Monthly budget updated! 🎯');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add Expense Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Expense</h3>
        </div>

        <form onSubmit={handleSubmitExpense} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Amount (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-lg font-semibold text-input-text placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-input-text appearance-none cursor-pointer"
              >
                <option value="Food" className="dark:bg-slate-900">Food</option>
                <option value="Travel" className="dark:bg-slate-900">Travel</option>
                <option value="Subscriptions" className="dark:bg-slate-900">Subscriptions</option>
                <option value="Shopping" className="dark:bg-slate-900">Shopping</option>
                <option value="Other" className="dark:bg-slate-900">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-input-text"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was this for?"
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all min-h-[120px] resize-none text-input-text placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Expense
          </button>
        </form>
      </motion.div>

      {/* Budget Settings Section */}
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Monthly Budget</h3>
          </div>

          <form onSubmit={handleUpdateBudget} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Set Limit (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-lg font-semibold text-input-text placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-slate-100 dark:shadow-none transition-all active:scale-[0.98]"
            >
              Update Budget Goal
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-50 dark:bg-indigo-500/10 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20"
        >
          <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Why set a budget?</h4>
          <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
            Setting a monthly limit helps our AI provide better insights and warns you before you overspend. 
            Most students find that tracking expenses reduces impulsive buying by 20%.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
