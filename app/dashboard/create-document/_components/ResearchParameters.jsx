"use client";
import React from "react";
import { cn } from "@/lib/utils";

const ResearchParameters = ({
  currentStep,
  parameters,
  selectedValues,
  setSelectedValues,
}) => {
  const currentParam = parameters[currentStep - 1];
  if (!currentParam) return null;

  const handleSelect = (value, index) => {
    const updated = [...selectedValues];
    updated[index] = value;
    setSelectedValues(updated);
  };

  return (
    <div className="md:mt-8 mt-4 text-left max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {currentParam.options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => handleSelect(option, currentStep - 1)}
            className={cn(
              "px-6 py-3 w-full rounded-lg border dark:border-gray-200/30 text-left text-sm font-medium transition-all duration-200 cursor-pointer",
              selectedValues[currentStep - 1] === option
                ? "bg-primary text-white border-primary"
                : "bg-white text-muted-foreground dark:bg-black dark:text-white dark:hover:text-white dark:hover:bg-gray-200/10 hover:text-primary dark:hover:border-gray-200/10 hover:border-primary hover:bg-primary/10"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResearchParameters;
