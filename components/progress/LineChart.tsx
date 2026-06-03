"use client";

import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: { date: string; score: number }[];
  title: string;
  color?: string;
}

export default function LineChart({ data, title, color = "#10b981" }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No data yet. Start practicing to see your progress!
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
          <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}
