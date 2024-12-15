import { mixpanel } from "@/mixpanel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const { event, properties } = data;
    mixpanel.track(event, properties);
    return NextResponse.json({ status: "Event tracked successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}