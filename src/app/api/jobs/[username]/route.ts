import { getJobsForGenome } from "@/backend/get-jobs-for-genome";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;

    console.log(`[API] Fetching jobs for username: ${username}`);

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const data = await getJobsForGenome(username);
    console.log(`[API] Jobs fetched successfully for: ${username}`);
    console.log(`[API] Total jobs found: ${data.total}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error fetching jobs:", error);
    if (error instanceof Error) {
      // Check if the error message indicates a 404
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        return NextResponse.json(
          { error: "Jobs not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

