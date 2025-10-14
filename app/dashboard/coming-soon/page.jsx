"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SparklesText } from "@/components/ui/sparkles-text";
import { RainbowButton } from "@/components/ui/rainbow-button";

const CustomizeSoon = () => {
  const router = useRouter();

  return (
    <div className="text-center space-y-2 w-full  fixed md:ml-34 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
      <SparklesText
        className={
          "text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4"
        }
      >
        Customization Coming Soon
      </SparklesText>

      <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
        Big things are happening at Documate and you’re at the center of it.
        We’re building a next-level customization experience that gives you full
        control over how Documate works for you.
      </p>

      <RainbowButton
        onClick={() => router.push("/dashboard")}
        variant="outline"
      >
        Back to Dashboard
      </RainbowButton>
    </div>
  );
};

export default CustomizeSoon;
