"use client";

import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: { date: string; minutes: number }[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No data yet.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
          <Bar dataKey="minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}
