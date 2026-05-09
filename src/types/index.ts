export type TransactionType = "income" | "expense";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  monthlyBudget: number;
  themePreference?: "light" | "dark" | "system";
  createdAt?: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
}

export interface Budget {
  _id?: string;
  month: string;
  limit: number;
  spent: number;
  remaining: number;
  status: "safe" | "warning" | "exceeded";
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  budgetUsage: number;
}

export interface AnalyticsCategory {
  name: string;
  value: number;
  fill: string;
}

export interface AnalyticsMonthly {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentTransactions: Transaction[];
  categoryBreakdown: AnalyticsCategory[];
  monthlyOverview: AnalyticsMonthly[];
  budget: Budget;
}

export interface AuthResponse {
  token: string;
  user: User;
}
