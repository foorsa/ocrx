import { NextRequest, NextResponse } from "next/server";
import { Documents } from "@/redux/data/Documents";


export async function GET(Request: NextRequest) {
    return NextResponse.json(Documents);
}