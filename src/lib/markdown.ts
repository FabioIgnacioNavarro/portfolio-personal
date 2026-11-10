import { marked } from 'marked';

const markdownCache = new Map<string, string>();

export function renderMarkdown(markdownText: string): string {
  if (!markdownText) return '';
  const cached = markdownCache.get(markdownText);
  if (cached !== undefined) return cached;

  const parsed = marked.parse(markdownText, { async: false }) as string;
  markdownCache.set(markdownText, parsed);
  return parsed;
}
