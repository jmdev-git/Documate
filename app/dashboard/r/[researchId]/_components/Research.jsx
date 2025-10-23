import React from "react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, Send } from "lucide-react";
import AiResponse from "./AiResponse";
import { usePathname } from "next/navigation";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/motion-primitives/morphing-popover";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";
import UndefinedPage from "@/app/dashboard/undefined/page";

const Research = ({
  preference,
  setUserInput,
  userInput,
  response,
  loading,
}) => {
  const pathname = usePathname();

  return (
    <div className="container mt-14 relative overflow-hidden">
      {response ? (
        <AiResponse response={response} />
      ) : loading ? (
        <TextShimmerWave className="text-base" duration={1}>
          Thinking about your research...
        </TextShimmerWave>
      ) : pathname === "/dashboard/r/undefined" ? (
        <UndefinedPage />
      ) : (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:ml-30 md:space-y-14 space-y-8 lg:w-[800px] p-4 w-full">
          <div className="text-center">
            <SparklesText
              className={
                "md:text-[2.7rem] text-4xl font-bold capitalize text-primary dark:text-white tracking-tighter"
              }
            >
              <TextAnimate animation="blurIn">
                Ready to Begin Your Research?
              </TextAnimate>
            </SparklesText>
            <p className="max-w-lg text-muted-foreground mx-auto md:mt-2 mt-1.5">
              Ask a question or describe your topic, and Documate will help you
              create well-researched insights instantly.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto relative">
            <div className="flex items-end gap-2 bg-background border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 shadow-md focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-200">
              <MorphingPopover
                variants={{
                  initial: { opacity: 0, filter: "blur(10px)" },
                  animate: { opacity: 1, filter: "blur(0px)" },
                  exit: { opacity: 0, filter: "blur(10px)" },
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <MorphingPopoverTrigger asChild>
                  <Button
                    layoutId="morphing-popover-custom-transition-variants-label"
                    layout="position"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    <InfoIcon size={18} />
                  </Button>
                </MorphingPopoverTrigger>

                <MorphingPopoverContent
                  className={`
                    w-60 px-4 py-2 shadow-md dark:bg-black dark:border-gray-200/30
                    absolute
                    left-0 sm:right-0
                  `}
                >
                  <div className="grid gap-2 text-sm">
                    <h4 className="text-base font-semibold tracking-tight">
                      Preferences
                    </h4>
                    {preference.map((p, i) => (
                      <div key={i} className="grid gap-1.5">
                        <span className="text-sm">
                          <strong className="font-semibold">
                            Content Type:
                          </strong>{" "}
                          {p.content_type}
                        </span>
                        <span className="text-sm">
                          <strong className="font-semibold">Citation:</strong>{" "}
                          {p.citation_style}
                        </span>
                        <span className="text-sm">
                          <strong className="font-semibold">Style:</strong>{" "}
                          {p.writing_style}
                        </span>
                        <span className="text-sm">
                          <strong className="font-semibold">Tone:</strong>{" "}
                          {p.tone}
                        </span>
                      </div>
                    ))}
                  </div>
                </MorphingPopoverContent>
              </MorphingPopover>

              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask anything here..."
                rows={1}
                className={`flex-1 resize-none shadow-none bg-transparent border-0 focus-visible:ring-0 focus-visible:outline-none text-sm dark:bg-none dark:text-white min-h-[2.5rem] max-h-52 overflow-y-auto`}
              />

              <Button
                type="submit"
                size="icon"
                disabled={!userInput.trim()}
                className="bg-primary hover:bg-primary/90 text-white rounded-lg cursor-pointer"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
