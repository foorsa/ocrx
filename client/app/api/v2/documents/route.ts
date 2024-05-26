import { Documents } from "@/redux/data/Documents";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, res: NextResponse) {
	console.log(
		`[${new Date().toLocaleTimeString()}] ${req.url} - ${req.method}`
	);
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
