import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await req.json();
    return NextResponse.json({
        message: `Hello!`
    })
}