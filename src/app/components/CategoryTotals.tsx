"use client";

import type { Transaction } from "../page";

type CategoryTotalsProps = {
  transactions: Transaction[];
};

type CategoryTotal = {
  category: string;
  income: number;
  expense: number;
};

export default function CategoryTotals({ transactions }: CategoryTotalsProps) {
  const categoryMap = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { category: t.category, income: 0, expense: 0 };
    }
    if (t.type === "income") {
      acc[t.category].income += t.amount;
    } else {
      acc[t.category].expense += t.amount;
    }
    return acc;
  }, {} as Record<string, CategoryTotal>);

  const categoryTotals = Object.values(categoryMap);
  categoryTotals.sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  const maxTotal = Math.max(...categoryTotals.map(c => c.income + c.expense), 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Total by Category</h2>
      {categoryTotals.length === 0 ? (
        <p className="text-slate-400 text-sm py-4 text-center">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {categoryTotals.map((cat) => {
            const total = cat.income + cat.expense;
            const barWidth = (total / maxTotal) * 100;
            const hasIncome = cat.income > 0;
            const hasExpense = cat.expense > 0;
            return (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{cat.category}</span>
                  <span className="font-semibold text-slate-800">${total.toLocaleString()}</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                  {hasIncome && (
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(cat.income / total) * barWidth}%` }}
                      title={`Income: $${cat.income.toLocaleString()}`}
                    />
                  )}
                  {hasExpense && (
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${(cat.expense / total) * barWidth}%` }}
                      title={`Expense: $${cat.expense.toLocaleString()}`}
                    />
                  )}
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  {hasIncome && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      +${cat.income.toLocaleString()}
                    </span>
                  )}
                  {hasExpense && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      -${cat.expense.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}