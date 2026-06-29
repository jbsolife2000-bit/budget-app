"use client";

import { useState, useEffect } from "react"; // 👈 Import useEffect
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AddTransaction from "./components/AddTransaction";
import ExpenseChart from "./components/ExpenseChart";

// Define the Transaction type
export type Transaction = {
  id: number;
  category: string;
  amount: number;
  type: "income" | "expense";
};

export default function Home() {
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, category: "Salary", amount: 2500, type: "income" },
    { id: 2, category: "Rent", amount: 1200, type: "expense" },
    { id: 3, category: "Groceries", amount: 450, type: "expense" },
    { id: 4, category: "Transport", amount: 200, type: "expense" },
    { id: 5, category: "Freelance", amount: 800, type: "income" },
  ]);

  // ✅ Load from localStorage on mount (before return)
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved transactions", e);
      }
    }
  }, []); // Empty dependency = run once

  // ✅ Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Derived totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Add a new transaction
  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    const maxId = transactions.reduce((max, t) => Math.max(max, t.id), 0);
    setTransactions([...transactions, { ...newTx, id: maxId + 1 }]);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" /> BudgetFlow
          </h1>
          <p className="text-slate-500 mt-1">Track your money, build your wealth.</p>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm font-medium text-blue-200">Current Balance</p>
            <h2 className="text-4xl font-extrabold mt-2">${balance.toLocaleString()}</h2>
            <p className="text-xs mt-4 opacity-80">Updated just now</p>
          </div>

          {/* Income Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total Income</p>
              <ArrowUpRight className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mt-4">+${totalIncome.toLocaleString()}</h3>
            <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[70%]"></div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total Expenses</p>
              <ArrowDownRight className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-500 mt-4">-${totalExpenses.toLocaleString()}</h3>
            <div className="mt-4 h-2 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[30%]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Form and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AddTransaction onAddTransaction={handleAddTransaction} />
          <ExpenseChart />
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className="flex justify-between border-b py-2 last:border-0">
                <span className="text-slate-700">{t.category}</span>
                <span
                  className={
                    t.type === "income"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}