"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Transaction } from "@/types";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const createTransaction = async (values: Omit<Transaction, "_id">) => {
    const transaction = await api.createTransaction(values);
    setTransactions((current) => [transaction, ...current]);
  };

  const updateTransaction = async (values: Omit<Transaction, "_id">) => {
    if (!editingTransaction) return;
    const updated = await api.updateTransaction(editingTransaction._id, values);
    setTransactions((current) => current.map((item) => (item._id === editingTransaction._id ? updated : item)));
    setEditingTransaction(null);
  };

  const deleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions((current) => current.filter((item) => item._id !== id));
    toast.success("Transaction deleted");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {(isModalOpen || editingTransaction) && (
        <TransactionForm
          isEdit={!!editingTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={editingTransaction ? updateTransaction : createTransaction}
          initialValues={
            editingTransaction
              ? {
                  title: editingTransaction.title,
                  amount: editingTransaction.amount,
                  type: editingTransaction.type,
                  category: editingTransaction.category,
                  date: editingTransaction.date.slice(0, 10)
                }
              : undefined
          }
        />
      )}
      <TransactionsTable
        transactions={loading ? [] : transactions}
        onAdd={() => setIsModalOpen(true)}
        onDelete={deleteTransaction}
        onEdit={(transaction) => setEditingTransaction(transaction)}
      />
      {loading && <LoadingSkeleton className="h-72" />}
    </div>
  );
}
