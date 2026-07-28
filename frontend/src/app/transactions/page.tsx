"use client";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import {
  createTransaction,
  deleteTransaction,
  fetchCategories,
  fetchTransactions,
  updateTransaction,
} from "@/lib/api";
import type { Category, Transaction } from "@/types";

export default function TransactionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const loadTransactions = () => {
    fetchTransactions({ from: from || undefined, to: to || undefined, categoryId })
      .then(setTransactions)
      .catch((error) => setErrorMessage(error.message));
  };

  useEffect(() => {
    fetchCategories().then(setCategories).catch((error) => setErrorMessage(error.message));
  }, []);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, categoryId]);

  const openNewForm = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleSave = async (data: { category_id: number; date: string; amount: number; memo: string }) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data);
    }
    setShowForm(false);
    loadTransactions();
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!window.confirm(`「${transaction.memo || transaction.category.name}」を削除しますか？`)) return;
    try {
      await deleteTransaction(transaction.id);
      loadTransactions();
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <main className="container">
      <div className="filter-row">
        <div className="form-row">
          <label htmlFor="from">開始日</label>
          <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="to">終了日</label>
          <input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="filter-category">カテゴリ</label>
          <select
            id="filter-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.kind === "income" ? "収入" : "支出"} / {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNewForm}>
          + 新規登録
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <TransactionTable transactions={transactions} onEdit={openEditForm} onDelete={handleDelete} />

      {showForm && (
        <TransactionForm
          categories={categories}
          initial={editingTransaction}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
