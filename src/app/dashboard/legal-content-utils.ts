export function htmlToPlainText(html: string): string {
  const normalized = html.replace(/>\s+</g, "><").trim();
  const withLists = normalized.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, inner: string) => {
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => `- ${m[1].trim()}`);
    return `\n\n${items.join("\n")}\n\n`;
  });

  return withLists
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function plainTextToHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));

      if (isList) {
        const items = lines.map((l) => `<li>${l.slice(2).trim()}</li>`).join("\n");
        return `<ul class="list-disc pl-[33px]">\n${items}\n</ul>`;
      }

      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}
