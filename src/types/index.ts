export type Category = 'Food' | 'Travel' | 'Subscriptions' | 'Shopping' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
}

export interface Budget {
  monthlyLimit: number;
}

export interface Insight {
  type: 'warning' | 'alert' | 'info' | 'success';
  message: string;
}
