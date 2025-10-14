"use client";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { CheckCircle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";
import remarkGfm from "remark-gfm";

const AiResponse = ({ response, onGenerate }) => {
  const [generatedText, setGeneratedText] = useState(null);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (!response) return;

    let i = 0;
    setIsTypingDone(false);
    const interval = setInterval(() => {
      setGeneratedText(response.slice(0, i + 1));
      i++;
      if (i >= response.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <div>
      {!response ? (
        <TextShimmerWave className="text-base" duration={1}>
          Thinking about your research...
        </TextShimmerWave>
      ) : (
        <div
          className={`bg-white rounded-lg p-4 md:pb-2 ${
            isTypingDone && "pb-26"
          } dark:bg-gray-200/10 w-full relative`}
        >
          <div className="md:relative">
            <SparklesText
              className={
                "md:heading text-[1.4rem] md:mb-4 mb-2 text-primary dark:text-white"
              }
            >
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle /> Generated Results
              </div>
            </SparklesText>
            <div className="absolute md:right-0 md:top-0 bottom-0 md:w-auto w-full md:left-auto left-0 md:p-0 p-4">
              {isTypingDone && (
                <div className="flex md:flex-row flex-col-reverse items-center gap-2 w-full">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={onGenerate}
                          variant="outline"
                          size={"sm"}
                          className="cursor-pointer rounded-sm md:w-auto w-full"
                        >
                          <RefreshCw />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent variant="light">
                        <p>Change Generated Answer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size={"sm"}
                    className="cursor-pointer rounded-sm bg-primary text-white md:w-auto w-full"
                  >
                    <a href="/dashboard/coming-soon"></a>
                    Proceed to Customize
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="md:text-3xl text-xl font-bold mb-4 tracking-tight dark:text-white"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="md:text-2xl text-lg font-semibold mt-4 mb-2 dark:text-white"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-base leading-relaxed mb-3 dark:text-white"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside space-y-2 pl-4 dark:text-white"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-700 dark:text-white" {...props} />
                  ),
                }}
              >
                {generatedText}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResponse;
