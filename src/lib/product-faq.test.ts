import { beforeEach, expect, it, vi } from "vitest";
import content from "../../data/cms-content.json";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/netlify-blobs", () => ({ readCmsContentBlob: vi.fn(), writeCmsContentBlob: vi.fn() }));

import { getCmsContent, saveCmsContent } from "./cms-content";
import { readCmsContentBlob, writeCmsContentBlob } from "./netlify-blobs";
import { DEFAULT_PRODUCT_FAQ } from "./product-faq";

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(readCmsContentBlob).mockResolvedValue(JSON.stringify(content));
  vi.mocked(writeCmsContentBlob).mockResolvedValue(true);
});

it("keeps existing product questions for CMS records without the new field", async () => {
  const old = structuredClone(content);
  delete (old.productDetail as Record<string, unknown>).faq;
  vi.mocked(readCmsContentBlob).mockResolvedValue(JSON.stringify(old));
  expect((await getCmsContent()).productDetail.faq).toEqual(DEFAULT_PRODUCT_FAQ);
});

it("saves edited questions and reads them back without losing content", async () => {
  const cms = await getCmsContent();
  cms.productDetail.faq = [{ question: "Updated question?", answer: "Updated answer\nSecond line" }];
  await saveCmsContent(cms);
  const saved = vi.mocked(writeCmsContentBlob).mock.calls[0][0];
  vi.mocked(readCmsContentBlob).mockResolvedValue(JSON.stringify(saved));
  expect((await getCmsContent()).productDetail.faq).toEqual(cms.productDetail.faq);
});

it("rejects blank answers before saving", async () => {
  const cms = await getCmsContent();
  cms.productDetail.faq = [{ question: "Question?", answer: "  " }];
  await expect(saveCmsContent(cms)).rejects.toThrow();
  expect(writeCmsContentBlob).not.toHaveBeenCalled();
});
