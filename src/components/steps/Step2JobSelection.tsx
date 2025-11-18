"use client";

import { useState, useEffect } from "react";

interface Step2JobSelectionProps {
  onJobSelect?: (jobId: string) => void;
  initialSelected?: string;
  username?: string;
}

interface Job {
  id: string;
  objective: string;
  organizations?: Array<{ name: string }>;
  tagline: string;
  compensation?: {
    data?: {
      code: string;
      currency: string;
      minAmount?: number;
      maxAmount?: number;
      minHourlyUSD?: number;
      maxHourlyUSD?: number;
      periodicity: string;
      negotiable: boolean;
      conversionRateUSD: number;
    };
    visible: boolean;
  };
}

export function Step2JobSelection({
  onJobSelect,
  initialSelected,
  username,
}: Step2JobSelectionProps) {
  const [selectedJob, setSelectedJob] = useState<string | undefined>(
    initialSelected
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError("Username is required");
      return;
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/jobs/${username}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch jobs");
        }

        const data = await response.json();
        console.log(data);
        setJobs(data.results || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching jobs"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [username]);

  const handleSelect = (jobId: string) => {
    setSelectedJob(jobId);
    onJobSelect?.(jobId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading jobs...</div>
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

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No jobs found for this profile.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => handleSelect(job.id)}
          className={`rounded-md border bg-card p-4 text-card-foreground shadow-sm cursor-pointer transition-all flex flex-col gap-1 ${
            selectedJob === job.id
              ? "border-primary ring-2 ring-primary ring-offset-2"
              : "hover:bg-accent"
          }`}
        >
          {job.organizations && job.organizations.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {job.organizations[0].name}
            </div>
          )}
          <div className="font-semibold">{job.objective}</div>
          <div className="text-sm text-muted-foreground">
            {job.tagline}
          </div>
          {job.compensation?.visible && job.compensation?.data && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              {job.compensation.data.code === "range" &&
              job.compensation.data.minAmount &&
              job.compensation.data.maxAmount ? (
                <span>
                  {job.compensation.data.currency}{" "}
                  {job.compensation.data.minAmount.toLocaleString()} -{" "}
                  {job.compensation.data.currency}{" "}
                  {job.compensation.data.maxAmount.toLocaleString()}
                  {job.compensation.data.periodicity === "yearly" && "/year"}
                  {job.compensation.data.periodicity === "monthly" && "/month"}
                  {job.compensation.data.periodicity === "hourly" && "/hour"}
                  {job.compensation.data.negotiable && " (negotiable)"}
                </span>
              ) : job.compensation.data.minAmount ? (
                <span>
                  {job.compensation.data.currency}{" "}
                  {job.compensation.data.minAmount.toLocaleString()}
                  {job.compensation.data.periodicity === "yearly" && "/year"}
                  {job.compensation.data.periodicity === "monthly" && "/month"}
                  {job.compensation.data.periodicity === "hourly" && "/hour"}
                  {job.compensation.data.negotiable && " (negotiable)"}
                </span>
              ) : (
                <span>Compensation available</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

