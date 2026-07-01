"use client";

import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, X, Pencil, Check, X as XIcon, Search } from "lucide-react";
import AddTransaction from "./components/AddTransaction";
import ExpenseChart from "./components/ExpenseChart";
import CategoryTotals from "./components/CategoryTotals";

export type Transaction = {
  id: number;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type FilterType = "all" | "income" | "expense";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, category: "Salary", amount: 2500, type: "income", date: "2026-06-28" },
    { id: 2, category: "Rent", amount: 1200, type: "expense", date: "2026-06-27" },
    { id: 3, category: "Groceries", amount: 450, type: "expense", date: "2026-06-26" },
    { id: 4, category: "Transport", amount: 200, type: "expense", date: "2026-06-25" },
    { id: 5, category: "Freelance", amount: 800, type: "income", date: "2026-06-24" },
    { id: 6, category: "Salary", amount: 100, type: "expense", date: "2026-06-23" },
  ]);

  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved transactions", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    const maxId = transactions.reduce((max, t) => Math.max(max, t.id), 0);
    setTransactions([...transactions, { ...newTx, id: maxId + 1 }]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditStart = (t: Transaction) => {
    setEditingId(t.id);
    setEditCategory(t.category);
    setEditAmount(t.amount.toString());
    setEditType(t.type);
    setEditDate(t.date);
  };

  const handleEditSave = (id: number) => {
    const numericAmount = parseFloat(editAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!editCategory) {
      alert("Please select a category.");
      return;
    }
    if (!editDate) {
      alert("Please select a date.");
      return;
    }
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, category: editCategory, amount: numericAmount, type: editType, date: editDate }
          : t
      )
    );
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "income" && t.type !== "income") return false;
    if (filter === "expense" && t.type !== "expense") return false;
    if (searchTerm && !t.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" /> BudgetFlow
          </h1>
          <p className="text-slate-500 mt-1">Track your money, build your wealth.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm font-medium text-blue-200">Current Balance</p>
            <h2 className="text-4xl font-extrabold mt-2">${balance.toLocaleString()}</h2>
            <p className="text-xs mt-4 opacity-80">Updated just now</p>
          </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AddTransaction onAddTransaction={handleAddTransaction} />
          <div className="space-y-6">
            <ExpenseChart transactions={transactions} />
            <CategoryTotals transactions={transactions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg flex-shrink-0">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                    filter === "all"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("income")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                    filter === "income"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-slate-500 hover:text-green-600"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilter("expense")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                    filter === "expense"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-slate-500 hover:text-red-600"
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>
          </div>

          <ul>
            {filteredTransactions.length === 0 ? (
              <p className="text-slate-400 text-sm py-4 text-center">
                {searchTerm 
                  ? `No transactions found for "${searchTerm}"` 
                  : `No ${filter !== "all" ? filter : ""} transactions to show`}
              </p>
            ) : (
              filteredTransactions.map((t) => {
                const isEditing = editingId === t.id;
                return (
                  <li key={t.id} className="flex items-center justify-between border-b py-2 last:border-0">
                    {isEditing ? (
                      <div className="flex-1 flex flex-wrap items-center gap-2 py-1">
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setEditType("expense")}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                              editType === "expense"
                                ? "bg-red-500 text-white shadow"
                                : "text-slate-500"
                            }`}
                          >
                            Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditType("income")}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                              editType === "income"
                                ? "bg-green-500 text-white shadow"
                                : "text-slate-500"
                            }`}
                          >
                            Income
                          </button>
                        </div>

                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select category</option>
                          <option value="Salary">Salary</option>
                          <option value="Housing">Housing/Rent</option>
                          <option value="Food">Food & Dining</option>
                          <option value="Transport">Transportation</option>
                          <option value="Entertainment">Entertainment</option>
                        </select>

                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="pl-6 pr-2 py-1 text-sm border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          onClick={() => handleEditSave(t.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          aria-label="Save edit"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="Cancel edit"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-medium">{t.category}</span>
                          <span className="text-xs text-slate-400">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              t.type === "income"
                                ? "text-green-600 font-semibold"
                                : "text-red-500 font-semibold"
                            }
                          >
                            {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleEditStart(t)}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            aria-label="Edit transaction"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Delete transaction"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}