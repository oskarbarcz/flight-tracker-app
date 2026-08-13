export type NotamSegment = {
  offset: number;
  text: string;
  emphasized: boolean;
};

const BOLD_SEGMENT = /<b>([\s\S]*?)<\/b>/gi;
const BOLD_TAG = /<\/?b>/gi;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

function hasMarkupBeyondBold(html: string): boolean {
  return html.replace(BOLD_TAG, "").includes("<");
}

function decodeEntities(value: string): string {
  return value.replace(/&(#?\w+);/g, (entity, name) => ENTITIES[name.toLowerCase()] ?? entity);
}

export function toNotamSegments(html: string, text: string): NotamSegment[] {
  const plain: NotamSegment[] = [{ offset: 0, text, emphasized: false }];
  if (html === "" || hasMarkupBeyondBold(html)) return plain;

  const segments: NotamSegment[] = [];
  let cursor = 0;

  for (const match of html.matchAll(BOLD_SEGMENT)) {
    const start = match.index;
    if (start > cursor) {
      segments.push({ offset: cursor, text: decodeEntities(html.slice(cursor, start)), emphasized: false });
    }
    segments.push({ offset: start, text: decodeEntities(match[1]), emphasized: true });
    cursor = start + match[0].length;
  }

  if (cursor < html.length) {
    segments.push({ offset: cursor, text: decodeEntities(html.slice(cursor)), emphasized: false });
  }

  const meaningful = segments.filter((segment) => segment.text !== "");
  return meaningful.length > 0 ? meaningful : plain;
}
