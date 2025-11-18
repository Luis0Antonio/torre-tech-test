import { searchGenome } from "@/backend/search-genome";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    console.log(`[API] Fetching genome data for username: ${username}`);

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const data = await searchGenome(username);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error fetching genome data:", error);
    if (error instanceof Error) {
      // Check if the error message indicates a 404
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        return NextResponse.json(
          { error: "Genome not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch genome data" },
      { status: 500 }
    );
  }
}

