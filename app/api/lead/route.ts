import { validateLead } from "@/lib/lead";

/**
 * Receives "Book a Demo" submissions and forwards them to LEADS_WEBHOOK_URL
 * (e.g. a Zapier/Make/Slack/CRM webhook). Never reports success unless the
 * lead was actually delivered; the original site's form silently dropped leads.
 *
 * Accepts JSON from the enhanced form, and a plain form post (before JS loads),
 * which gets a redirect to /demo/thanks or /demo/unsent.
 */
type Outcome = { status: number; body: Record<string, unknown> };

async function handle(body: Record<string, unknown>): Promise<Outcome> {
  // Honeypot: real visitors never fill the hidden "website" field.
  if (typeof body.website === "string" && body.website.trim() !== "") return { status: 200, body: { ok: true } };

  const result = validateLead(body);
  if ("error" in result) return { status: 400, body: { error: result.error.reason, field: result.error.field } };

  const destination = process.env.LEADS_WEBHOOK_URL;
  if (!destination) return { status: 503, body: { error: "not_configured" } };

  try {
    const res = await fetch(destination, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...result.lead, source: "indilabs.ai/demo", receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) return { status: 502, body: { error: "delivery_failed" } };
  } catch {
    return { status: 502, body: { error: "delivery_failed" } };
  }
  return { status: 200, body: { ok: true } };
}

export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  const isForm = type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");

  let body: Record<string, unknown>;
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const outcome = await handle(body);
  if (isForm) {
    const to = outcome.status === 200 ? "/demo/thanks" : "/demo/unsent";
    return Response.redirect(new URL(to, request.url), 303);
  }
  return Response.json(outcome.body, { status: outcome.status });
}
