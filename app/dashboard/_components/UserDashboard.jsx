"use client";
import { FileText, FilePlus, PackageOpen } from "lucide-react";
import React from "react";
import Graph from "./Graph";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Dashboard = () => {
  const data = [
    {
      title: "Document Lists",
      description: "All uploaded study files",
      icon: <FileText size={20} className="text-primary dark:text-white" />,
      count: 0 || 0,
      text: "View All Documents",
      delay: 0,
    },
    {
      title: "Created Documents",
      description: "Files generated through AI",
      icon: <FilePlus size={20} className="text-primary dark:text-white" />,
      count: 0 || 0,
      text: "Create Document",
      delay: 0.1,
      href: "/dashboard/create-document",
    },
    {
      title: "Prompt History",
      description: "Previous AI prompts",
      icon: <PackageOpen size={20} className="text-primary dark:text-white" />,
      count: 0 || 0,
      text: "View All History",
      delay: 0.2,
    },
  ];

  return (
    <div className="container">
      <h2 className="heading">Dashboard</h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {data.map((d, i) => (
          <a href={d.href} key={i}>
            <div className="p-4 bg-white dark:bg-black dark:border-gray-200/30 border rounded-lg flex flex-col gap-4">
              <div className="relative">
                <div>
                  <h4 className="text-xl font-semibold tracking-tight text-primary dark:text-white">
                    {d.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {d.description}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 dark:bg-gray-200/20 rounded-sm absolute right-0 top-0 dark:border dark:border-gray-200/20">
                  <span>{d.icon}</span>
                </div>
              </div>
              <NumberTicker value={d.count} className="text-4xl font-bold" />
              <RainbowButton variant="outline">{d.text}</RainbowButton>
            </div>
          </a>
        ))}
      </div>
      <Graph />
    </div>
  );
};

export default Dashboard;
