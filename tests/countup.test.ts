import { describe, expect, it } from "vitest";
import { parseFigure } from "@/components/ui/CountUp";

describe("parseFigure", () => {
  it("parses en-dash ranges", () => {
    expect(parseFigure("25–30%")).toEqual({ from: 25, to: 30, sep: "–", suffix: "%" });
  });
  it("parses hyphen ranges", () => {
    expect(parseFigure("10-15%")).toEqual({ from: 10, to: 15, sep: "-", suffix: "%" });
  });
  it("parses single values", () => {
    expect(parseFigure("40%")).toEqual({ from: null, to: 40, sep: "", suffix: "%" });
  });
  it("returns null for non-figures so text renders as-is", () => {
    expect(parseFigure("Riskube")).toBeNull();
  });
});
