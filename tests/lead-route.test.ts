import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lead/route";

const req = (body: unknown) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const valid = { name: "Test", company: "Acme Lending", email: "ops@acme.example", message: "Hello" };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/lead", () => {
  it("rejects an invalid email with 400", async () => {
    const res = await POST(req({ ...valid, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ field: "email" });
  });

  it("rejects a missing company with 400", async () => {
    const res = await POST(req({ ...valid, company: "  " }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ field: "company" });
  });

  it("returns 503 instead of faking success when no destination is configured", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "");
    const res = await POST(req(valid));
    expect(res.status).toBe(503);
  });

  it("forwards the lead to the webhook and returns 200", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.example/lead");
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.example/lead");
    expect(JSON.parse(init.body)).toMatchObject({ company: "Acme Lending", email: "ops@acme.example" });
  });

  it("returns 502 when the webhook fails", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.example/lead");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("no", { status: 500 })));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
  });

  it("handles a no-JS form post by redirecting to the thank-you page", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.example/lead");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("ok", { status: 200 })));
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(valid).toString(),
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost/demo/thanks");
  });

  it("redirects a failed no-JS form post to the not-sent page", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "");
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(valid).toString(),
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost/demo/unsent");
  });

  it("silently accepts but drops honeypot submissions", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.example/lead");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ ...valid, website: "spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
