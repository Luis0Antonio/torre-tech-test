import { generateSummary } from "@/backend/generate-summary";
import { searchGenome } from "@/backend/search-genome";
import { getJobsForGenome } from "@/backend/get-jobs-for-genome";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, jobId } = body;

    console.log(`[API] Generating summary for username: ${username}, jobId: ${jobId}`);

    if (!username || !jobId) {
      return NextResponse.json(
        { error: "Username and jobId are required" },
        { status: 400 }
      );
    }

    // Fetch genome data
    console.log(`[API] Fetching genome data for: ${username}`);
    const genomeData = await searchGenome(username);

    // Fetch jobs and find the specific job
    console.log(`[API] Fetching jobs for: ${username}`);
    const jobsData = await getJobsForGenome(username);
    const jobData = jobsData.results?.find((job: { id: string }) => job.id === jobId);

    if (!jobData) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Generate summary
    console.log(`[API] Generating summary...`);
    const summary = await generateSummary(genomeData, jobData);
    console.log(`[API] Summary generated successfully`);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[API] Error generating summary:", error);
    if (error instanceof Error) {
      // Check if the error message indicates a 404
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        return NextResponse.json(
          { error: "Genome or job not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

