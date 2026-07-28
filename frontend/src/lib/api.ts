import type { Category, CategorySummaryRow, MonthlySummary, Transaction } from "@/types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.errors?.join(", ") || `リクエストに失敗しました(${res.status})`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function fetchCategories(): Promise<Category[]> {
  return request<Category[]>("/api/categories");
}

export function createCategory(data: { name: string; kind: string }): Promise<Category> {
  return request<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify({ category: data }),
  });
}

export function updateCategory(id: number, data: { name: string; kind: string }): Promise<Category> {
  return request<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ category: data }),
  });
}

export function deleteCategory(id: number): Promise<void> {
  return request<void>(`/api/categories/${id}`, { method: "DELETE" });
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  categoryId?: number | "";
}

export function fetchTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.categoryId) params.set("category_id", String(filters.categoryId));
  const query = params.toString();
  return request<Transaction[]>(`/api/transactions${query ? `?${query}` : ""}`);
}

export interface TransactionInput {
  category_id: number;
  date: string;
  amount: number;
  memo?: string;
}

export function createTransaction(data: TransactionInput): Promise<Transaction> {
  return request<Transaction>("/api/transactions", {
    method: "POST",
    body: JSON.stringify({ transaction: data }),
  });
}

export function updateTransaction(id: number, data: TransactionInput): Promise<Transaction> {
  return request<Transaction>(`/api/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ transaction: data }),
  });
}

export function deleteTransaction(id: number): Promise<void> {
  return request<void>(`/api/transactions/${id}`, { method: "DELETE" });
}

export function fetchMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
  return request<MonthlySummary>(`/api/summary/monthly?year=${year}&month=${month}`);
}

export function fetchCategorySummary(from: string, to: string): Promise<CategorySummaryRow[]> {
  return request<CategorySummaryRow[]>(`/api/summary/by_category?from=${from}&to=${to}`);
}
