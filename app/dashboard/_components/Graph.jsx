"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { title: "Document Lists", count: 24 },
  { title: "Created Documents", count: 12 },
  { title: "Prompt History", count: 36 },
];

const Graph = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4 md:flex hidden rounded-lg bg-white border mt-4 dark:bg-black dark:border-gray-200/30">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={theme === "dark" ? "#545454" : "#dedede"}
          />
          <XAxis
            dataKey="title"
            tick={{
              fontSize: 11,
              fill: theme === "dark" ? "#ffffff" : "#525252",
            }}
            angle={-10}
            textAnchor="end"
          />

          <YAxis tick={{ fill: theme === "dark" ? "#ffffff" : "#525252" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="count"
            radius={[12, 12, 0, 0]}
            fill="url(#colorBlue)"
            barSize={400}
          />
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
