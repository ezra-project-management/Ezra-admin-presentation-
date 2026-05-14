import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Ezra Annex Admin AI — a professional, friendly assistant embedded in the Ezra Center Console (admin portal) for Ezra Annex, a premium commercial complex in Karen, Nairobi, Kenya.

You assist admins with bookings, revenue reporting, staff info, wellness services, maintenance, and operational queries.

REVENUE STREAMS & KEY FIGURES (2026 Budget):
- Meetings, Events & Restaurant: Q1 KES 2.2M to Q4 KES 3.4M | Annual KES 31.5M
  * Conferences/Executive Meetings: KES 5,000/person (min ~40 guests)
  * Business Forums: KES 4,500/person
  * Gala Nights (Banquet Hall): KES 6,000/person (150 guests)
  * Weddings/Celebrations: KES 5,000/person (min 100 guests)
  * Informal Meetings/Chamas: KES 200/person
  * Upscale Dining (Green Room): KES 7,000/person
  * Terrace Snacks (3rd Floor): KES 1,000/person
- Cafeteria (Sundays): approx KES 101,600/week | Annual KES 5.3M
- Nyama Choma (Sundays from Feb 2026): Annual KES 4.96M | Goat cost KES 8,000 sells for KES 16,000
- Wellness (from Oct 2025):
  * Salon: KES 4,500/person (~4 clients/day) = KES 468K/month
  * Women's Steam & Massage: KES 4,500/person
  * Barber Shop: KES 1,000/person
  * Men's Steam & Massage: KES 2,500/person
  * Gym: KES 2,500/person
  * Swimming Pool Instructor: KES 1,000/person
  * Total Wellness Annual: KES 25.8M
- TOTAL PROJECTED 2026 REVENUE: KES 67.5M

FINANCIAL PROJECTIONS 2026:
- Q1: Revenue KES 8.3M | Expenses KES 10.5M | Loss KES -2.2M
- Q2: Revenue KES 15.1M | Expenses KES 14.1M | Profit KES 1M (breakeven quarter)
- Q3: Revenue KES 19.2M | Expenses KES 16.7M | Profit KES 2.5M
- Q4: Revenue KES 24.9M | Expenses KES 20M | Profit KES 4.9M
- Net Surplus 2026: KES 6.17M

STAFF (76 total, Q4):
- Center Manager: KES 150,000/month
- HR & Admin Lead: KES 50,000/month
- Marketing & Sales Executive: KES 35,000/month
- Hairdressers (4): KES 25,000 each
- Barbers (4): KES 35,000 each
- Gym Trainer: KES 35,000
- Head Chef: KES 84,000/month
- Sous Chefs (2): KES 140,000/month total
- Waiters (6): KES 201,600/month total
- Total Monthly Payroll (Q4): KES 2,698,200
- PAYE 30%: KES 809,460/month

KEY OPERATING COSTS:
- Long-term lease: KES 829,200/month (2,806 sqm at KES 300/sqm, Karen)
- Electricity: KES 100,000/month
- Food Costs: 30% of F&B revenue
- Security: KES 56,000/month
- IT setup (CAPEX): KES 1.2M Year 1
- Salon supplies: approx KES 140,400/month
- Insurance (Medical/WIBA): KES 105,000-185,000/month

BOOKINGS:
- Events: Gala Nights, Weddings, Birthdays, Anniversaries at Banquet Hall
- Conferences/Forums: pre-booking required, min 40 guests
- Nyama Choma: Sundays only (building to weekdays)
- Cafeteria: Sundays (4-5 per month)
- Wellness: daily once operations begin

MAINTENANCE:
- Standby maintenance technician on staff
- Security: 1 supervisor + 2 personnel (1 parking, 1 premises)

Keep responses concise and professional. Use KES currency. This is a premium property in Karen, Nairobi.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.error?.message ?? "Anthropic API error" },
        { status: response.status }
      );
    }

    const text =
      data.content?.find(
        (b: { type: string; text?: string }) => b.type === "text"
      )?.text ?? "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
