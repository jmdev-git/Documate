"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { ClockAlert } from "lucide-react";

const CustomizeSoon = () => {
  const router = useRouter();

  return (
    <div className="text-center space-y-2 w-full  fixed md:ml-34 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 max-w-lg mx-auto">
      <ClockAlert className="m-auto text-primary md:size-26 size-20 mb-3" />
      <SparklesText
        className={"text-4xl md:text-6xl font-bold text-primary tracking-tight mb-4"}
      >
        Customization Coming Soon
      </SparklesText>

      <p className="text-sm text-muted-foreground mb-6 md:w-96 w-full m-auto">
        Big updates ahead! Soon you’ll be able to customize Documate your way.
      </p>

      <Magnetic>
        <Button
          variant="primary"
          className={"bg-primary text-white cursor-pointer"}
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Magnetic>
    </div>
  );
};

export default CustomizeSoon;
