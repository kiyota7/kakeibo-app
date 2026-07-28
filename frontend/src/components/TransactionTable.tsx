"use client";

import type { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>種別</th>
          <th>カテゴリ</th>
          <th>金額</th>
          <th>メモ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 && (
          <tr>
            <td colSpan={6}>取引がありません</td>
          </tr>
        )}
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.date}</td>
            <td>{transaction.category.kind === "income" ? "収入" : "支出"}</td>
            <td>{transaction.category.name}</td>
            <td>¥{transaction.amount.toLocaleString()}</td>
            <td>{transaction.memo}</td>
            <td>
              <button type="button" className="btn" onClick={() => onEdit(transaction)}>
                編集
              </button>{" "}
              <button type="button" className="btn btn-danger" onClick={() => onDelete(transaction)}>
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
