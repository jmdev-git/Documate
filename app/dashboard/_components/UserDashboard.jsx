"use client";
import { FileText, FilePlus, PackageOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession();
  const [parameterCount, setParameterCount] = useState(0);
  const [parameterMonth, setParameterMonth] = useState([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [historyMonth, setHistoryMonth] = useState([]);

  useEffect(() => {
    if (session.status !== "authenticated") return;

    const getParameterCount = async () => {
      try {
        const res = await fetch(
          `/api/parameters?userId=${session?.data?.user.id}`
        );
        const data = await res.json();

        if (res.ok) {
          setParameterCount(data.count);
          setParameterMonth(data.formatted);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getPromptHistoryCount = async () => {
      try {
        const res = await fetch(
          `/api/history?userId=${session?.data?.user.id}`
        );
        const data = await res.json();

        if (res.ok) {
          setHistoryCount(data.count);
          setHistoryMonth(data.formatted);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getParameterCount();
    getPromptHistoryCount();
  }, [session]);

  const data = [
    {
      title: "Document Lists",
      description: "All uploaded study files",
      icon: <FileText size={40} className="text-white" />,
      count: "Soon",
      text: "View All Documents",
      delay: 0,
      color: "bg-gradient-to-tr from-[#3847bd] to-[#7797e3]",
    },
    {
      title: "Created Documents",
      description: "Files generated through AI",
      icon: <FilePlus size={40} className="text-white" />,
      count: parameterCount || 0,
      text: "Create Document",
      delay: 0.1,
      color: "bg-gradient-to-tr from-[#b7301e] to-[#f68273]",
    },
    {
      title: "Prompt History",
      description: "Previous AI prompts",
      icon: <PackageOpen size={40} className="text-white" />,
      count: historyCount || 0,
      text: "View All History",
      delay: 0.2,
      color: "bg-gradient-to-tr from-[#1c6048] to-[#55b288]",
    },
  ];

  return (
    <div className="container">
      <h2 className="heading">Dashboard</h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {data.map((d, i) => (
          <div
            key={i}
            className={`p-4 shadow-sm ${d.color} rounded-lg flex flex-col gap-4`}
          >
            <div className="relative">
              <div>
                <h4 className="text-xl font-semibold tracking-tight text-white">
                  {d.title}
                </h4>
                <p className="text-gray-200 text-sm">{d.description}</p>
              </div>
              <div className="absolute right-0 top-9">
                <span>{d.icon}</span>
              </div>
            </div>
            {d.count === "Soon" ? (
              <span className="md:text-4xl text-3xl font-bold tracking-tighter text-white">
                {d.count}
              </span>
            ) : (
              <NumberTicker
                value={d.count}
                className="md:text-4xl text-3xl font-bold text-white"
              />
            )}
          </div>
        ))}
      </div>
      <Graph
        parameterCount={parameterCount}
        historyCount={historyCount}
        parameterMonth={parameterMonth}
        historyMonth={historyMonth}
      />
    </div>
  );
};

export default Dashboard;
