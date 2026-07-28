"use client";

import { useEffect, useState } from "react";
import MonthSelector from "@/components/MonthSelector";
import { fetchCategorySummary, fetchMonthlySummary } from "@/lib/api";
import type { CategorySummaryRow, MonthlySummary } from "@/types";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function monthRange(year: number, month: number): { from: string; to: string } {
  const from = `${year}-${pad2(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  return { from, to };
}

export default function DashboardPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categoryRows, setCategoryRows] = useState<CategorySummaryRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { from, to } = monthRange(year, month);

    Promise.all([fetchMonthlySummary(year, month), fetchCategorySummary(from, to)])
      .then(([summaryData, rows]) => {
        setSummary(summaryData);
        setCategoryRows(rows);
        setErrorMessage("");
      })
      .catch((error) => setErrorMessage(error.message));
  }, [year, month]);

  const expenseRows = categoryRows.filter((row) => row.kind === "expense");
  const incomeRows = categoryRows.filter((row) => row.kind === "income");

  return (
    <main className="container">
      <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="card">
        <h2>月別集計</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="label">収入合計</div>
            <div className="value">¥{(summary?.income_total ?? 0).toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="label">支出合計</div>
            <div className="value">¥{(summary?.expense_total ?? 0).toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="label">差引</div>
            <div className="value">¥{(summary?.balance ?? 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>カテゴリ別内訳(支出)</h2>
        <table>
          <thead>
            <tr>
              <th>カテゴリ</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {expenseRows.length === 0 && (
              <tr>
                <td colSpan={2}>データがありません</td>
              </tr>
            )}
            {expenseRows.map((row) => (
              <tr key={row.category_id}>
                <td>{row.name}</td>
                <td>¥{row.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>カテゴリ別内訳(収入)</h2>
        <table>
          <thead>
            <tr>
              <th>カテゴリ</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {incomeRows.length === 0 && (
              <tr>
                <td colSpan={2}>データがありません</td>
              </tr>
            )}
            {incomeRows.map((row) => (
              <tr key={row.category_id}>
                <td>{row.name}</td>
                <td>¥{row.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
