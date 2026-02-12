'use client';

import React from 'react';
import Link from 'next/link';
import { useBudget } from '@/hooks/useBudget';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { 
  ArrowDownRight, IndianRupee, 
  Calendar, ShoppingBag, Utensils, Plane, Tv, MoreHorizontal, Trash2,
  TrendingUp, Wallet, PieChart as PieChartIcon, ArrowUpRight, AlertCircle, Target, Flame, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export const Dashboard = () => {
  const { 
    expenses, budget, totalSpent, remainingBudget, 
    percentageUsed, categoryTotals, deleteExpense, 
    disciplineScore, streak, isLoaded 
  } = useBudget();

  if (!isLoaded) return <div className="animate-pulse space-y-8">
    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  </div>;

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const recentTransactions = expenses.slice(0, 5);

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
    <div className="space-y-8 pb-12">
      {/* Header & Intro */}
      <div>
        <h2 className="text-3xl font-bold text-welcome mb-2">Welcome Back! 👋</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Smart Student Budget Coach helps students take control of their finances with real-time tracking, 
          predictive spending analysis, and intelligent budgeting insights.
        </p>
      </div>

      {/* Score and Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-2xl",
              disciplineScore >= 80 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
              disciplineScore >= 60 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}>
              <Target className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Financial Discipline</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{disciplineScore} / 100</h3>
            </div>
          </div>
          <div className="text-right">
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full",
              disciplineScore >= 80 ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" :
              disciplineScore >= 60 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300"
            )}>
              {disciplineScore >= 80 ? 'Excellent' : disciplineScore >= 60 ? 'Good' : 'Needs Work'}
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Control Streak</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{streak} Days</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              On Fire 🔥
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-indigo-100 font-medium mb-1">Total Monthly Spending</p>
            <h3 className="text-5xl font-bold flex items-center gap-1 mb-6">
              <IndianRupee className="w-10 h-10" strokeWidth={2.5} />
              {totalSpent.toLocaleString()}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Monthly Budget: ₹{budget.monthlyLimit.toLocaleString()}</span>
                <span>{percentageUsed.toFixed(1)}% used</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, percentageUsed)}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    percentageUsed > 90 ? "bg-rose-400" : percentageUsed > 70 ? "bg-amber-400" : "bg-emerald-400"
                  )}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center"
        >
          <div className="bg-emerald-50 dark:bg-emerald-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Remaining Budget</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{remainingBudget.toLocaleString()}</h3>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" /> Keep it up!
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Spending Breakdown</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <Calendar className="w-12 h-12 opacity-20" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <Link 
              href="/transactions"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((expense) => (
                <div key={expense.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800/50 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{expense.category}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">₹{expense.amount}</p>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <ShoppingBag className="w-12 h-12 opacity-20" />
                <p>Start adding expenses to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
