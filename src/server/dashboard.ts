import { Budget } from "@/server/models/Budget";
import { Transaction } from "@/server/models/Transaction";
import { getCurrentMonthLabel, getMonthRange } from "@/server/month";
import { serializeBudget, serializeTransaction } from "@/server/serializers";

const CHART_COLORS = ["#0f766e", "#ea580c", "#2563eb", "#db2777", "#16a34a"];

export function buildDashboardAnalytics(
  transactions: Array<{
    _id: string | { toString(): string };
    title: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: Date | string;
    notes?: string | null;
  }>,
  fallbackBudget: number,
  currentMonth: string,
  budgetRecord?: { _id?: string | { toString(): string }; limit?: number } | null
) {
  const { monthStart, monthEnd } = getMonthRange();

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const categoryMap = new Map<string, number>();
  const monthMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      categoryMap.set(transaction.category, (categoryMap.get(transaction.category) || 0) + transaction.amount);
    }

    const month = new Date(transaction.date).toLocaleString("en-US", { month: "short" });
    const entry = monthMap.get(month) || { income: 0, expense: 0 };
    if (transaction.type === "income") {
      entry.income += transaction.amount;
    } else {
      entry.expense += transaction.amount;
    }
    monthMap.set(month, entry);
  });

  const spent = transactions
    .filter((item) => item.type === "expense" && new Date(item.date) >= monthStart && new Date(item.date) <= monthEnd)
    .reduce((sum, item) => sum + item.amount, 0);
  const limit = budgetRecord?.limit || fallbackBudget;

  return {
    summary: {
      totalBalance,
      totalIncome,
      totalExpense,
      savingsRate,
      budgetUsage: limit ? (spent / limit) * 100 : 0
    },
    recentTransactions: transactions.slice(0, 6).map(serializeTransaction),
    categoryBreakdown: Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    })),
    monthlyOverview: Array.from(monthMap.entries()).map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense
    })),
    budget: serializeBudget(budgetRecord, currentMonth, limit, spent)
  };
}

export async function getDashboardAnalytics(userId: string, fallbackBudget = 3200) {
  const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
  const currentMonth = getCurrentMonthLabel();
  const budgetRecord = await Budget.findOne({ user: userId, month: currentMonth });

  return buildDashboardAnalytics(transactions, fallbackBudget, currentMonth, budgetRecord);
}
