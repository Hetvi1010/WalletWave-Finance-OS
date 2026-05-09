type SerializableUser = {
  _id: string | { toString(): string };
  name: string;
  email: string;
  currency: string;
  monthlyBudget: number;
  themePreference: "light" | "dark" | "system";
  createdAt?: Date | string;
};

type SerializableTransaction = {
  _id: string | { toString(): string };
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date | string;
  notes?: string | null;
};

type SerializableBudget = {
  _id?: string | { toString(): string };
};

export function serializeUser(user: SerializableUser) {
  const createdAt = user.createdAt ? new Date(user.createdAt).toISOString() : undefined;

  return {
    id: typeof user._id === "string" ? user._id : user._id.toString(),
    name: user.name,
    email: user.email,
    currency: user.currency,
    monthlyBudget: user.monthlyBudget,
    themePreference: user.themePreference,
    createdAt
  };
}

export function serializeTransaction(transaction: SerializableTransaction) {
  return {
    _id: typeof transaction._id === "string" ? transaction._id : transaction._id.toString(),
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: new Date(transaction.date).toISOString(),
    notes: transaction.notes || ""
  };
}

export function serializeBudget(
  budget: SerializableBudget | null | undefined,
  month: string,
  limit: number,
  spent: number
) {
  const remaining = limit - spent;

  return {
    _id: budget?._id ? (typeof budget._id === "string" ? budget._id : budget._id.toString()) : undefined,
    month,
    limit,
    spent,
    remaining,
    status: remaining < 0 ? "exceeded" : remaining < limit * 0.2 ? "warning" : "safe"
  } as const;
}
