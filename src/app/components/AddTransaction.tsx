"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Transaction } from "../page"; // import the type from page

// Props: we expect a callback to add a new transaction
type AddTransactionProps = {
  onAddTransaction: (newTx: Omit<Transaction, "id">) => void;
};

export default function AddTransaction({ onAddTransaction }: AddTransactionProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }

    // Call the parent callback with the new transaction (id will be assigned in parent)
    onAddTransaction({
      category,
      amount: numericAmount,
      type,
    });

    // Reset form
    setAmount("");
    setCategory("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" /> Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between Income and Expense */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
              type === "expense" ? "bg-red-500 text-white shadow" : "text-slate-500"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
              type === "income" ? "bg-green-500 text-white shadow" : "text-slate-500"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Amount</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            <option value="Salary">Salary</option>
            <option value="Housing">Housing/Rent</option>
            <option value="Food">Food & Dining</option>
            <option value="Transport">Transportation</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg"
        >
          Add to Budget
        </button>
      </form>
    </div>
  );
}