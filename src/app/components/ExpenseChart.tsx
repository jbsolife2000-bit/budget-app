"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingDown } from "lucide-react";

// Mock data for the chart
const data = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 450 },
  { name: "Transport", value: 200 },
  { name: "Fun", value: 150 },
];

// Modern, aesthetic color paletteS
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function ExpenseChart() {
    return <div style={{ padding: '20px', background: 'lightgreen' }}>ExpenseChart works</div>;

    
}