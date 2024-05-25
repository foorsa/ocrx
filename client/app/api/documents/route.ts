import { Documents } from "@/redux/data/Documents";
import { NextApiRequest, NextApiResponse } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 minute
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 60 * 1000;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	return new Response(JSON.stringify(Documents), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store, max-age=0",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Max-Age": "86400",
		},
	});
}
