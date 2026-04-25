"use client";

// Lightweight markdown renderer for assistant messages only.
// Pipeline (ui-specialist F7 + F9): escape FIRST, then regex-replace.
// Tolerates *single* OR **double** asterisks for bold.
// Groups consecutive `- ` lines into a single <ul>.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function applyBold(input: string): string {
  // **bold** first (greedier) then *bold*. Both produce <strong>.
  return input
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>");
}

// Convert consecutive `- ` lines into a single <ul><li>...</li></ul>.
function groupBulletLines(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (buffer.length === 0) return;
    out.push(`<ul>${buffer.map((b) => `<li>${b}</li>`).join("")}</ul>`);
    buffer = [];
  };
  for (const line of lines) {
    const m = line.match(/^\s*-\s+(.*)$/);
    if (m) {
      buffer.push(m[1]);
    } else {
      flush();
      out.push(line);
    }
  }
  flush();
  return out.join("\n");
}

function paragraphsAndBreaks(text: string): string {
  // Split on \n\n into paragraphs, then convert remaining \n to <br/>.
  return text
    .split(/\n{2,}/)
    .map((para) => {
      if (para.startsWith("<ul>") || para.startsWith("<")) return para;
      return `<p>${para.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

export function renderMarkdownLite(raw: string): string {
  const escaped = escapeHtml(raw);
  const bolded = applyBold(escaped);
  const grouped = groupBulletLines(bolded);
  return paragraphsAndBreaks(grouped);
}

type Props = { text: string };

export function MarkdownLite({ text }: Props) {
  const html = renderMarkdownLite(text);
  return (
    <div
      className="markdown-lite text-base leading-relaxed"
      // Safe: input was escaped before any tag insertion.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
