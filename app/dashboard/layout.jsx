"use client";
import React, { useState } from "react";
import AppSidebar from "./_components/AppSidebar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div>
      <Header expanded={expanded} setMobileOpen={setMobileOpen} />
      <AppSidebar
        expanded={expanded}
        setExpanded={setExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={`overflow-hidden transition-all duration-200 ${
          expanded ? "md:ml-64" : "ml-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
