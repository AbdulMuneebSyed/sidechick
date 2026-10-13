/**
 * Source IDs (see sources/):
 *  S1 – indilabs.ai home page, including text inside its images
 *  S2 – indilabs.ai/about
 *  S3 – copy shipped in the site's code bundle (segment text, tab labels, form text)
 */
export type Source = "S1" | "S2" | "S3";

export type Copy = { readonly text: string; readonly src: Source };

/** Tag a string with the indilabs.ai source it comes from. */
export const c = (text: string, src: Source): Copy => ({ text, src });
