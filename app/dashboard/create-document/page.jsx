"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import ResearchParameters from "./_components/ResearchParameters";
import { cn } from "@/lib/utils";
import { parameters } from "@/constant";
import { toast } from "react-toastify";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useSession } from "next-auth/react";

const CreateDocument = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedValues, setSelectedValues] = useState(
    Array(parameters.length).fill("")
  );
  const router = useRouter();
  const session = useSession();

  const steps = [
    {
      step: 1,
      title: "Stepe",
      description: parameters[0].title,
    },
    {
      step: 2,
      title: "Step",
      description: parameters[1].title,
    },
    {
      step: 3,
      title: "Step",
      description: parameters[2].title,
    },
    {
      step: 4,
      title: "Step",
      description: parameters[3].title,
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Saving your preferences...");

    const parameter = {
      content_type: selectedValues[0],
      citation_style: selectedValues[1],
      writing_style: selectedValues[2],
      tone: selectedValues[3],
    };

    try {
      const res = await fetch("/api/parameters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parameter, email: session?.data?.user.email }),
      });

      const data = await res.json();

      if (res) {
        toast.update(loadingToast, {
          render: "Preferences saved successfully.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        router.replace(`/dashboard/r/${data.id}`);
      } else {
        toast.update(loadingToast, {
          render: "Something went wrong. Please try again!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto md:py-13 py-4">
            <h4 className="heading text-center capitalize pb-2">
              Choose your preferences to generate a document.
            </h4>
            <Stepper
              value={currentStep}
              onValueChange={(newStep) => {
                if (newStep > currentStep && !selectedValues[currentStep - 1]) {
                  toast.warning("Select one to proceed.");
                  return;
                }
                setCurrentStep(newStep);
              }}
            >
              {steps.map(({ step, title, description }) => (
                <StepperItem
                  key={step}
                  step={step}
                  className="relative flex-1 flex-col!"
                >
                  <StepperTrigger
                    disabled={
                      step > currentStep ||
                      (step > 1 && !selectedValues[step - 2])
                    }
                    className="flex-col gap-3 rounded"
                  >
                    <StepperIndicator className="text-black dark:text-white" />
                    <div className="space-y-0.5 px-2">
                      <StepperTitle>{title}</StepperTitle>
                      <StepperDescription className="max-sm:hidden">
                        {description}
                      </StepperDescription>
                    </div>
                  </StepperTrigger>
                  {step < steps.length && (
                    <StepperSeparator
                      className={cn(
                        "absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none transition-colors duration-300",
                        currentStep > step ? "bg-blue-600" : "bg-gray-300"
                      )}
                    />
                  )}
                </StepperItem>
              ))}
            </Stepper>
            <ResearchParameters
              currentStep={currentStep}
              parameters={parameters}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
            />
            <div className="flex justify-center space-x-4 mt-8">
              <RainbowButton
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
              >
                <ArrowLeft /> Prev step
              </RainbowButton>
              <RainbowButton
                type="button"
                variant="outline"
                onClick={() => {
                  if (!selectedValues[currentStep - 1]) {
                    toast.warning("Select one to proceed.");
                    return;
                  }

                  if (currentStep === steps.length) {
                    handleSubmit();
                  } else {
                    handleNextStep();
                  }
                }}
                disabled={currentStep > steps.length}
              >
                {currentStep === steps.length ? "Finish" : "Next step"}
                <ArrowRight />
              </RainbowButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateDocument;
