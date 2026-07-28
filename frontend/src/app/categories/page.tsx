"use client";

import { useEffect, useState } from "react";
import CategoryForm from "@/components/CategoryForm";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "@/lib/api";
import type { Category, CategoryKind } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = () => {
    fetchCategories().then(setCategories).catch((error) => setErrorMessage(error.message));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNewForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSave = async (data: { name: string; kind: CategoryKind }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
    setShowForm(false);
    loadCategories();
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`「${category.name}」を削除しますか？`)) return;
    try {
      await deleteCategory(category.id);
      loadCategories();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const expenseCategories = categories.filter((c) => c.kind === "expense");
  const incomeCategories = categories.filter((c) => c.kind === "income");

  return (
    <main className="container">
      <div className="filter-row">
        <button type="button" className="btn btn-primary" onClick={openNewForm}>
          + カテゴリ登録
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="card">
        <h2>支出カテゴリ</h2>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenseCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button type="button" className="btn" onClick={() => openEditForm(category)}>
                    編集
                  </button>{" "}
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(category)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>収入カテゴリ</h2>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {incomeCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button type="button" className="btn" onClick={() => openEditForm(category)}>
                    編集
                  </button>{" "}
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(category)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <CategoryForm initial={editingCategory} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}
