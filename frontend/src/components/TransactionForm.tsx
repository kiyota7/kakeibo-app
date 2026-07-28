"use client";

import { useState } from "react";
import type { Category, Transaction } from "@/types";

interface TransactionFormProps {
  categories: Category[];
  initial?: Transaction | null;
  onSave: (data: { category_id: number; date: string; amount: number; memo: string }) => Promise<void>;
  onClose: () => void;
}

export default function TransactionForm({ categories, initial, onSave, onClose }: TransactionFormProps) {
  const [categoryId, setCategoryId] = useState<number>(initial?.category_id ?? categories[0]?.id ?? 0);
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    try {
      await onSave({ category_id: categoryId, date, amount: Number(amount), memo });
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? "取引を編集" : "取引を登録"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="date">日付</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="category">カテゴリ</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.kind === "income" ? "収入" : "支出"} / {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="amount">金額</label>
            <input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="memo">メモ(任意)</label>
            <textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
