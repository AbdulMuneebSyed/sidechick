import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Copy } from "@/content/copy";
import { EDITS } from "@/content/edits";
import { site } from "@/content/site";

// Rule 1: every string shown on the site must exist on indilabs.ai.
const snapshot = ["rendered-pages.txt", "bundle-strings.txt"]
  .map((f) => readFileSync(join(__dirname, "..", "sources", f), "utf8"))
  .join("\n");

const normalize = (s: string) =>
  s
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const undoEdits = (s: string) =>
  EDITS.reduce((acc, [fixed, original]) => acc.split(fixed).join(original), s);

const isCopy = (v: unknown): v is Copy =>
  typeof v === "object" && v !== null && "text" in v && "src" in v;

function collect(node: unknown, path: string, out: Array<[string, Copy]>) {
  if (isCopy(node)) out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((n, i) => collect(n, `${path}[${i}]`, out));
  else if (typeof node === "object" && node !== null)
    for (const [k, v] of Object.entries(node)) collect(v, `${path}.${k}`, out);
}

const all: Array<[string, Copy]> = [];
collect(site, "site", all);
const haystack = normalize(snapshot);

describe("Rule 1: copy comes only from indilabs.ai", () => {
  it("finds copy to check", () => {
    expect(all.length).toBeGreaterThan(50);
  });

  it.each(all)("%s exists in the source snapshot", (_path, copy) => {
    expect(haystack).toContain(normalize(undoEdits(copy.text)));
  });

  it("rejects copy that is not on indilabs.ai", () => {
    expect(haystack).not.toContain(normalize("Trusted by leading lenders"));
  });

  it("has no untagged strings (internal `id` keys excepted)", () => {
    const walk = (n: unknown): void => {
      if (isCopy(n)) return;
      if (typeof n === "string") throw new Error(`Untagged string: "${n}"`);
      if (Array.isArray(n)) n.forEach(walk);
      else if (typeof n === "object" && n !== null)
        Object.entries(n).forEach(([k, v]) => k !== "id" && walk(v));
    };
    expect(() => walk(site)).not.toThrow();
  });
});
