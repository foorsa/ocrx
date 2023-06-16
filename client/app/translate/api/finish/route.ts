import { NextRequest, NextResponse } from "next/server";


export function POST(Request: NextRequest) {
    // Return a JSON Reponse for test
    return NextResponse.json({ message: "Hello World." });
}

export function GET(Request: NextRequest) {
    // Return a JSON Reponse for test
    return NextResponse.json({ message: "Hello World." });
}