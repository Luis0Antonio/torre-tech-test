"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface Step3SummaryProps {
  genome?: string;
  selectedJob?: string;
}

export function Step3Summary({ genome, selectedJob }: Step3SummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!genome || !selectedJob) {
        setError("Genome and job selection are required");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: genome,
            jobId: selectedJob,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to generate summary");
        }

        const data = await response.json();
        setSummary(data.summary || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while generating summary"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [genome, selectedJob]);

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Generating summary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-semibold">Summary</h3>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={!summary}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
          {summary || "No summary available"}
        </div>
      </div>
    </div>
  );
}

