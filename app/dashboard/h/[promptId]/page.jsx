"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import remarkGfm from "remark-gfm";

const PromptOverview = () => {
  const { promptId } = useParams();
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromptHistory = async () => {
      try {
        const res = await fetch(`/api/history/${promptId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setHistory(data.promptHistory);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPromptHistory();
  }, []);

  const date = new Date(history.createdAt);
  const formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const promptCreated = formattedDate.replace(",", " •");

  const handleAiResponse = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUserText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section>
      {history.length === 0 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:ml-34 ml-2">
          <Spinner className={"text-primary size-8"} />
        </div>
      ) : (
        <div className="container">
          <div className="space-y-4">
            <div className="flex justify-end relative">
              <div className="p-4 pb-12 md:w-3/4 w-full rounded-lg bg-primary text-white">
                {history.user_text}
              </div>
              <div className="absolute bottom-2 right-4 flex items-center gap-2">
                <span className="text-sm text-white/90">{promptCreated}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleUserText(history.user_text)}
                        size={"sm"}
                        className={"cursor-pointer text-white"}
                      >
                        {copied ? <Check /> : <Copy />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent variant="light">
                      <p>Copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg p-4 pb-12 dark:bg-gray-200/10 w-full">
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
                      <li
                        className="text-gray-700 dark:text-white"
                        {...props}
                      />
                    ),
                  }}
                >
                  {history.ai_response}
                </ReactMarkdown>
              </div>
              <div className="absolute bottom-2 left-4 flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleAiResponse(history.ai_response)}
                        variant={"outline"}
                        size={"sm"}
                        className={"cursor-pointer"}
                      >
                        {copied ? <Check /> : <Copy />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent variant="light">
                      <p>Copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-muted-foreground">
                  {promptCreated}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PromptOverview;
