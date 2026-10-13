/** Validation shared by the demo form (client) and /api/lead (server). Mirrors the original site's rules. */
export type Lead = { name: string; company: string; email: string; message: string };
export type LeadField = keyof Lead;

const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX = { name: 200, company: 200, email: 254, message: 5000 } as const;

export type LeadError = { field: LeadField; reason: "required" | "invalid" };

export function validateLead(input: Partial<Record<LeadField, unknown>>): { lead: Lead } | { error: LeadError } {
  const get = (k: LeadField) => (typeof input[k] === "string" ? (input[k] as string).trim().slice(0, MAX[k]) : "");
  const lead: Lead = { name: get("name"), company: get("company"), email: get("email"), message: get("message") };
  if (!lead.email) return { error: { field: "email", reason: "required" } };
  if (!EMAIL.test(lead.email)) return { error: { field: "email", reason: "invalid" } };
  if (!lead.company) return { error: { field: "company", reason: "required" } };
  return { lead };
}
