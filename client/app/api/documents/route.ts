import { NextRequest, NextResponse } from "next/server";
import { Documents } from "@/redux/data/Documents";

export async function GET(Request: NextRequest) {
	return NextResponse.json(Documents);
}

export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 24; // 24 hours
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 60 * 1000;
