"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Step1GenomeInputProps {
  onGenomeChange?: (genome: string) => void;
  initialValue?: string;
  error?: string | null;
  onErrorClear?: () => void;
}

export function Step1GenomeInput({
  onGenomeChange,
  initialValue = "",
  error,
  onErrorClear,
}: Step1GenomeInputProps) {
  const [genome, setGenome] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGenome(value);
    onGenomeChange?.(value);
    // Clear error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your genome username"
        value={genome}
        onChange={handleChange}
        className="w-full"
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  );
}

