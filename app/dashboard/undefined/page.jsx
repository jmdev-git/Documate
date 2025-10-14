import React from "react";

const UndefinedPage = () => {
  return (
    <div className="text-center space-y-2 w-full fixed md:ml-34 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img
        className="size-32 m-auto"
        src="/emptyFile.png"
        alt="Empty File Image"
      />
      <h2 className="text-2xl font-semibold text-muted-foreground tracking-tight">
        No document selected
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
        Please create or select your preferences to generate your first
        document. Once done, your generated content will appear here.
      </p>
    </div>
  );
};

export default UndefinedPage;
