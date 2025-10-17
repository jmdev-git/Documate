"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";

const Graph = ({ parameterMonth = [], historyMonth = [] }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allMonths = [
    ...new Set([
      ...parameterMonth.map((d) => d.month),
      ...historyMonth.map((d) => d.month),
    ]),
  ];

  const data = allMonths.map((month) => {
    const parameter = parameterMonth.find((d) => d.month === month);
    const history = historyMonth.find((d) => d.month === month);
    return {
      month,
      createdCount: parameter?.count || 0,
      historyCount: history?.count || 0,
    };
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="md:p-4 p-2 flex rounded-lg bg-white border mt-4 dark:bg-black dark:border-gray-200/30">
      <ResponsiveContainer width="100%" height={325}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={theme === "dark" ? "#545454" : "#dedede"}
          />
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 11,
              fill: theme === "dark" ? "#ffffff" : "#525252",
            }}
          />
          <YAxis
            tick={{
              fill: theme === "dark" ? "#ffffff" : "#525252",
            }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="createdCount"
            name="Created Documents"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="historyCount"
            name="Prompt History"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
