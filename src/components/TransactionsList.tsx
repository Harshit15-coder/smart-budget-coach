'use client';

import React, { useState } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { ShoppingBag, Utensils, Plane, Tv, MoreHorizontal, Trash2, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

export const TransactionsList = () => {
  const { expenses, deleteExpense, clearAllData, isLoaded } = useBudget();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');

  if (!isLoaded) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
  </div>;

  const filteredExpenses = expenses.filter(e => {
    const matchesFilter = filter === 'All' || e.category === filter;
    const matchesSearch = e.category.toLowerCase().includes(search.toLowerCase()) || 
                         (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food': return <Utensils className="w-4 h-4" />;
      case 'Travel': return <Plane className="w-4 h-4" />;
      case 'Subscriptions': return <Tv className="w-4 h-4" />;
      case 'Shopping': return <ShoppingBag className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">All Transactions</h2>
          {expenses.length > 0 && (
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to clear all data?')) clearAllData();
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            {['All', 'Food', 'Travel', 'Subscriptions', 'Shopping', 'Other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filter === cat 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence mode='popLayout'>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={expense.id} 
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {getCategoryIcon(expense.category)}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{expense.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                          {expense.notes || '—'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">₹{expense.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <ShoppingBag className="w-12 h-12 opacity-20" />
                        <p className="font-medium">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
