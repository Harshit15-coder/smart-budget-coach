'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/hooks/useBudget';
import { Zap, IndianRupee, Calculator, TrendingDown, ShieldCheck, MessageSquare, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateDisciplineScore } from '@/lib/insights';

export const AIPlanner = () => {
  const { totalSpent, budget, categoryTotals, expenses } = useBudget();
  const [reduction, setReduction] = useState('');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Simulation Logic
  const reductionAmt = parseFloat(reduction) || 0;
  const simulatedTotal = Math.max(0, totalSpent - reductionAmt);
  const simulatedProjection = Math.round((simulatedTotal / (expenses.length || 1)) * 30);
  const simulatedScore = calculateDisciplineScore(expenses, simulatedTotal, budget.monthlyLimit, categoryTotals);
  const sixMonthSavings = reductionAmt * 6;

  // AI Coach Logic (Rule-based)
  const handleAiQuery = () => {
    if (!query) return;
    
    const q = query.toLowerCase();
    const remaining = budget.monthlyLimit - totalSpent;
    
    let response = "";
    if (q.includes('afford') || q.includes('buy') || q.includes('can i')) {
      const match = q.match(/(\d+)/);
      const amount = match ? parseInt(match[0]) : 0;
      
      if (amount === 0) {
        response = "How much does it cost? Tell me the amount and I'll check your budget.";
      } else if (amount > remaining) {
        response = `❌ Honestly? No. You only have ₹${remaining.toLocaleString()} left this month. Buying this would put you ₹${(amount - remaining).toLocaleString()} over budget.`;
      } else if (amount > remaining * 0.5) {
        response = `⚠️ You can afford it, but it will take up over 50% of your remaining budget. I'd suggest waiting until next month if it's not urgent.`;
      } else {
        response = `✅ Yes! You have ₹${remaining.toLocaleString()} left, so this won't hurt your goals. Go for it!`;
      }
    } else if (q.includes('save') || q.includes('tips')) {
      response = "The best way to save is to limit 'Food' and 'Shopping' to 20% of your budget. Right now they are at " + 
        Math.round(((categoryTotals['Food'] || 0) + (categoryTotals['Shopping'] || 0)) / (totalSpent || 1) * 100) + "%.";
    } else {
      response = "I'm your budget coach! Ask me if you can afford something or how to save more.";
    }
    
    setAiResponse(response);
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Planning</h2>
        <p className="text-slate-600 dark:text-slate-400">Simulate spending changes and get AI-powered financial advice.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* What If Simulation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">"What If" Simulator</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">If I reduce my monthly spending by:</p>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={reduction}
                onChange={(e) => setReduction(e.target.value)}
                placeholder="Enter amount (e.g. 1000)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-lg font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">6-Month Savings</p>
              <h4 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">₹{sixMonthSavings.toLocaleString()}</h4>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">New Score</p>
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{simulatedScore}/100</h4>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-slate-400 mt-1" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your projected monthly spending would drop to <span className="font-bold text-slate-900 dark:text-slate-100">₹{simulatedProjection.toLocaleString()}</span>.
            </p>
          </div>
        </motion.div>

        {/* AI Budget Coach */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[2rem] shadow-xl text-white space-y-6 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Ask Budget Coach</h3>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Can I afford a ₹3000 headphone?"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all min-h-[100px] resize-none text-white placeholder:text-slate-500"
              />
            </div>
            <button 
              onClick={handleAiQuery}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              Analyze Purchase
            </button>
          </div>

          <AnimatePresence mode="wait">
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <div className="flex gap-3">
                  <Bot className="w-5 h-5 text-indigo-400 shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-200 italic">
                    "{aiResponse}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!aiResponse && (
            <div className="p-5 border border-dashed border-slate-700 rounded-2xl flex items-center justify-center">
              <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold">
                Coach is ready to assist
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Behavioral Insight Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-4"
      >
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 dark:text-indigo-100">Why Behavior Matters?</h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Students don't fail financially because of large purchases. They fail because of repeated small unconscious spending. 
            Our coach corrects patterns before they become habits.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
