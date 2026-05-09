import { AuthResponse, Budget, DashboardData, Transaction, User } from "@/types";
import { getStoredToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return (await response.json()) as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  signup: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getProfile: () => request<User>("/users/me"),
  updateProfile: (payload: Partial<User>) =>
    request<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  getDashboard: () => request<DashboardData>("/analytics/dashboard"),
  getTransactions: () => request<Transaction[]>("/transactions"),

  createTransaction: (payload: Omit<Transaction, "_id">) =>
    request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateTransaction: (id: string, payload: Partial<Transaction>) =>
    request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  deleteTransaction: (id: string) =>
    request<{ message: string }>(`/transactions/${id}`, {
      method: "DELETE"
    }),

  getBudget: () => request<Budget>("/budgets/current"),
  setBudget: (payload: { limit: number }) =>
    request<Budget>("/budgets", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  exportCsv: () => `${API_URL}/exports/transactions.csv`,
  exportPdf: () => `${API_URL}/exports/transactions.pdf`
};
