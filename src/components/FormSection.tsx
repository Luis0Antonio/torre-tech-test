"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormSectionProps {
  onButtonClick: () => void;
  className?: string;
}

export function FormSection({ onButtonClick, className }: FormSectionProps) {
  return (
    <section className={`w-full max-w-md space-y-6 ${className || ""}`}>
      <div className="space-y-4">
        <Input type="text" placeholder="Enter your text here" />
        <Button onClick={onButtonClick} className="w-full">
          Continue
        </Button>
      </div>
    </section>
  );
}

