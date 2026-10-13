/**
 * Functional interface text that the original site never needed because its
 * form never sent anything. Not marketing copy: no claims, numbers or features.
 * Kept separate from content/site.ts so the Rule 1 test stays strict.
 */
export const ui = {
  sending: "Sending…",
  failed: "Your message couldn’t be sent. Please email us instead:",
  optional: "optional",
} as const;
