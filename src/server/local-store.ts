import { promises as fs } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

export interface LocalUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  currency: string;
  monthlyBudget: number;
  themePreference: "light" | "dark" | "system";
  createdAt: string;
  updatedAt: string;
  isLocal: true;
}

export function isLocalUser(user: unknown): user is LocalUser {
  return Boolean(user && typeof user === "object" && "isLocal" in user && (user as LocalUser).isLocal);
}

export interface LocalTransaction {
  _id: string;
  user: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  notes?: string;
}

export interface LocalBudget {
  _id: string;
  user: string;
  month: string;
  limit: number;
}

interface LocalStore {
  users: LocalUser[];
  transactions: LocalTransaction[];
  budgets: LocalBudget[];
}

const storePath = path.join(process.cwd(), ".walletwave-local-db.json");

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    return { users: [], transactions: [], budgets: [] };
  }
}

async function writeStore(store: LocalStore) {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export async function findLocalUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((user) => user.email === email.toLowerCase()) || null;
}

export async function findLocalUserById(id: string) {
  const store = await readStore();
  return store.users.find((user) => user._id === id) || null;
}

export async function createLocalUser(values: { name: string; email: string; password: string }) {
  const store = await readStore();
  const now = new Date().toISOString();

  const user: LocalUser = {
    _id: crypto.randomUUID(),
    name: values.name,
    email: values.email.toLowerCase(),
    password: await bcrypt.hash(values.password, 10),
    currency: "USD",
    monthlyBudget: 3200,
    themePreference: "system",
    createdAt: now,
    updatedAt: now,
    isLocal: true
  };

  store.users.push(user);
  await writeStore(store);
  return user;
}

export async function verifyLocalUserPassword(user: LocalUser, password: string) {
  return bcrypt.compare(password, user.password);
}

export async function updateLocalUser(
  id: string,
  values: Partial<Pick<LocalUser, "name" | "currency" | "monthlyBudget" | "themePreference">>
) {
  const store = await readStore();
  const user = store.users.find((item) => item._id === id);

  if (!user) {
    return null;
  }

  if (values.name !== undefined) user.name = values.name;
  if (values.currency !== undefined) user.currency = values.currency;
  if (values.monthlyBudget !== undefined) user.monthlyBudget = values.monthlyBudget;
  if (values.themePreference !== undefined) user.themePreference = values.themePreference;
  user.updatedAt = new Date().toISOString();

  await writeStore(store);
  return user;
}

export async function listLocalTransactions(userId: string) {
  const store = await readStore();
  return store.transactions
    .filter((transaction) => transaction.user === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createLocalTransaction(
  userId: string,
  values: Omit<LocalTransaction, "_id" | "user">
) {
  const store = await readStore();
  const transaction: LocalTransaction = {
    _id: crypto.randomUUID(),
    user: userId,
    ...values
  };

  store.transactions.push(transaction);
  await writeStore(store);
  return transaction;
}

export async function updateLocalTransaction(
  id: string,
  userId: string,
  values: Partial<Omit<LocalTransaction, "_id" | "user">>
) {
  const store = await readStore();
  const transaction = store.transactions.find((item) => item._id === id && item.user === userId);

  if (!transaction) {
    return null;
  }

  Object.assign(transaction, values);
  await writeStore(store);
  return transaction;
}

export async function deleteLocalTransaction(id: string, userId: string) {
  const store = await readStore();
  store.transactions = store.transactions.filter((item) => !(item._id === id && item.user === userId));
  await writeStore(store);
}

export async function findLocalBudget(userId: string, month: string) {
  const store = await readStore();
  return store.budgets.find((budget) => budget.user === userId && budget.month === month) || null;
}

export async function upsertLocalBudget(userId: string, month: string, limit: number) {
  const store = await readStore();
  let budget = store.budgets.find((item) => item.user === userId && item.month === month);

  if (!budget) {
    budget = { _id: crypto.randomUUID(), user: userId, month, limit };
    store.budgets.push(budget);
  } else {
    budget.limit = limit;
  }

  await writeStore(store);
  return budget;
}
