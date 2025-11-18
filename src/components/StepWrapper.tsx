"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface StepWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  showContinue?: boolean;
  showBack?: boolean;
  continueButtonText?: string;
  backButtonText?: string;
  isLoading?: boolean;
}

export function StepWrapper({
  title,
  description,
  children,
  onContinue,
  onBack,
  showContinue = true,
  showBack = false,
  continueButtonText = "Continue",
  backButtonText = "Go Back",
  isLoading = false,
}: StepWrapperProps) {
  return (
    <div className=" space-y-6 ">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight font-roboto">{title}</h1>
        <p className="text-muted-foreground font-mulish">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
      {(showContinue || showBack) && (
        <div className="flex justify-start gap-4 ">
          {showBack && onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {backButtonText}
            </Button>
          )}
          {showContinue && (
            <Button 
              onClick={onContinue} 
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : continueButtonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

