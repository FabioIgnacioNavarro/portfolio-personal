import { marked } from 'marked';

export function renderMarkdown(markdownText: string): string {
  if (!markdownText) return '';
  return marked.parse(markdownText, { async: false }) as string;
}
