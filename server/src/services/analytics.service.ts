import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";

export async function getDashboardAnalytics(userId: string) {
  const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).lean();
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const totalIncome = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
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
    entry[transaction.type] += transaction.amount;
    monthMap.set(month, entry);
  });

  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const budgetRecord = await Budget.findOne({ user: userId, month: currentMonth }).lean();
  const spent = transactions
    .filter((item) => item.type === "expense" && new Date(item.date) >= monthStart && new Date(item.date) <= monthEnd)
    .reduce((sum, item) => sum + item.amount, 0);
  const limit = budgetRecord?.limit || 3200;
  const remaining = limit - spent;

  return {
    summary: {
      totalBalance,
      totalIncome,
      totalExpense,
      savingsRate,
      budgetUsage: limit ? (spent / limit) * 100 : 0
    },
    recentTransactions: transactions.slice(0, 6),
    categoryBreakdown: Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      fill: ["#4f46e5", "#06b6d4", "#f97316", "#ec4899", "#10b981"][index % 5]
    })),
    monthlyOverview: Array.from(monthMap.entries()).map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense
    })),
    budget: {
      month: currentMonth,
      limit,
      spent,
      remaining,
      status: remaining < 0 ? "exceeded" : remaining < limit * 0.2 ? "warning" : "safe"
    }
  };
}
