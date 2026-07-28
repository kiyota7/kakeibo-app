export type CategoryKind = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  kind: CategoryKind;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  memo: string | null;
  category_id: number;
  category: Category;
}

export interface MonthlySummary {
  year: number;
  month: number;
  income_total: number;
  expense_total: number;
  balance: number;
}

export interface CategorySummaryRow {
  category_id: number;
  name: string;
  kind: CategoryKind;
  total: number;
}
