'use client';

import React from 'react';
import { useBudget } from '@/hooks/useBudget';
import { generateInsights, calculateProjection } from '@/lib/insights';
import { motion } from 'framer-motion';
import { 
  Lightbulb, AlertCircle, AlertTriangle, CheckCircle2, 
  TrendingUp, TrendingDown, Info, IndianRupee 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const InsightsSection = () => {
  const { expenses, totalSpent, budget, categoryTotals, isLoaded } = useBudget();

  if (!isLoaded) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
  </div>;

  const insights = generateInsights(expenses, totalSpent, budget.monthlyLimit, categoryTotals);
  const projection = calculateProjection(expenses);
  const isOverBudget = budget.monthlyLimit > 0 && projection > budget.monthlyLimit;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'success': return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default: return <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-900 dark:text-rose-100';
      case 'warning': return 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-900 dark:text-amber-100';
      case 'success': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-100';
      default: return 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Smart AI Insights</h3>
          <p className="text-slate-500 dark:text-slate-400">Personalized financial coaching based on your habits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projection Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Projection</span>
              {isOverBudget ? (
                <div className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              ) : (
                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Projected Spending</p>
            <h4 className={cn(
              "text-3xl font-black mb-2",
              isOverBudget ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            )}>
              ₹{projection.toLocaleString()}
            </h4>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Based on your average daily spending of <span className="font-bold text-slate-600 dark:text-slate-300">₹{Math.round(totalSpent / (expenses.length || 1))}</span>.
            </p>
          </div>
        </motion.div>

        {/* Insight Cards */}
        <div className="lg:col-span-2 space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-6 rounded-[1.5rem] border flex items-start gap-4 transition-all hover:shadow-md",
                  getInsightStyles(insight.type)
                )}
              >
                <div className="mt-1">{getInsightIcon(insight.type)}</div>
                <div>
                  <h5 className="font-bold mb-1">
                    {insight.type === 'alert' ? 'Immediate Action Required' : 
                     insight.type === 'warning' ? 'Spending Warning' : 'Smart Tip'}
                  </h5>
                  <p className="text-sm opacity-90 leading-relaxed">{insight.message}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-center">
              <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">You're doing great! No warnings at the moment.</p>
              <p className="text-xs mt-1">Keep tracking your expenses to get more insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Category Efficiency</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Food', 'Travel', 'Subscriptions', 'Shopping'].map((cat) => {
            const amount = categoryTotals[cat as keyof typeof categoryTotals] || 0;
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            
            return (
              <div key={cat} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{cat}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100">₹{amount.toLocaleString()}</p>
                <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-tighter">
                  {percentage.toFixed(1)}% of total
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
