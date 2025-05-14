import { NextResponse } from "next/server";
import {auth0} from "@/lib/auth0";

export async function GET() {
    try {
        const accessToken  = await auth0.getAccessToken();

        if (!accessToken) {
            return NextResponse.json({ error: "No access token found" }, { status: 401 });
        }

        return NextResponse.json({ accessToken });
    } catch (e) {
        console.error("Token fetch error:", e);
        return NextResponse.json({ error: "Unable to get token" }, { status: 401 });
    }
}
