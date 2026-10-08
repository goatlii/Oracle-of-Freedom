import { NextResponse } from "next/server";
import { publicAvailability } from "@/lib/booking-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const typeId = new URL(request.url).searchParams.get("type")?.trim() || "";
  if (!/^[a-z0-9-]{1,60}$/.test(typeId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const result = await publicAvailability(typeId);
  if (!result) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({
    ok: true,
    timeZone: "Europe/Lisbon",
    slots: result.slots,
  });
}
