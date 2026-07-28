"use client";

import { useState } from "react";
import type { Category, CategoryKind } from "@/types";

interface CategoryFormProps {
  initial?: Category | null;
  onSave: (data: { name: string; kind: CategoryKind }) => Promise<void>;
  onClose: () => void;
}

export default function CategoryForm({ initial, onSave, onClose }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<CategoryKind>(initial?.kind ?? "expense");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    try {
      await onSave({ name, kind });
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? "カテゴリを編集" : "カテゴリを登録"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="category-name">名称</label>
            <input id="category-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="category-kind">種別</label>
            <select id="category-kind" value={kind} onChange={(e) => setKind(e.target.value as CategoryKind)}>
              <option value="expense">支出</option>
              <option value="income">収入</option>
            </select>
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
