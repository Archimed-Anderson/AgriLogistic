export type CsvRow = Record<string, string>;

/**
 * Parse CSV into array of objects.
 * - Supports quoted fields (double quotes), escaped quotes ("")
 * - Uses first row as headers
 */
export function parseCsvToObjects(csvText: string): CsvRow[] {
  const text = csvText.replace(/^\uFEFF/, ''); // strip BOM
  const rows: string[][] = [];

  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  const pushRow = () => {
    // Ignore completely empty trailing row
    if (row.length === 1 && row[0] === '') {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      pushField();
      continue;
    }

    if (ch === '\r') {
      // ignore, wait for \n
      continue;
    }

    if (ch === '\n') {
      pushField();
      pushRow();
      continue;
    }

    field += ch;
  }

  // flush last
  pushField();
  if (row.length > 0) pushRow();

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  const data = rows.slice(1);

  return data
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => {
      const obj: CsvRow = {};
      headers.forEach((h, idx) => {
        if (!h) return;
        obj[h] = (r[idx] ?? '').trim();
      });
      return obj;
    });
}

export function toCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>
): string {
  const escape = (value: string) => {
    const needsQuotes = /[",\n\r]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const line = (cells: Array<string | number | null | undefined>) =>
    cells.map((c) => escape((c ?? '').toString())).join(',');

  return [line(headers), ...rows.map(line)].join('\n');
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
