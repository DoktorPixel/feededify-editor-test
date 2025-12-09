// src/utils/useProductsFeedCsv.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../types";

const DEFAULT_LIMIT = 1000;

function stripBOM(s: string) {
  if (s.charCodeAt(0) === 0xfeff) return s.slice(1);
  return s;
}

function splitLines(s: string): string[] {
  return s.split(/\r\n|\n|\r/).filter(Boolean);
}

function parseCsvLine(line: string): string[] {
  const res: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && (ch === "," || ch === ";")) {
      res.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  res.push(cur);
  return res.map((c) => c.trim());
}

export function parseCsvStringToProducts(
  csvString: string,
  limit = DEFAULT_LIMIT
): Product[] {
  if (!csvString || !csvString.trim()) return [];

  const cleaned = stripBOM(csvString);
  const lines = splitLines(cleaned);
  if (lines.length === 0) return [];

  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine).map((h) => h || "");

  const products: Product[] = [];

  for (let i = 1; i < lines.length && products.length < limit; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    const product: Product = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j] || `col_${j}`;
      const val = cols[j] ?? "";
      if (val === "") continue;

      const prev = product[key];
      if (prev === undefined) {
        product[key] = val;
      } else if (Array.isArray(prev)) {
        prev.push(val);
      } else {
        product[key] = [prev, val];
      }
    }
    products.push(product);
  }

  return products;
}

export function useProductsFeedCsv(
  csvContent: string | null | undefined,
  opts?: { limit?: number; enabled?: boolean }
): UseQueryResult<Product[], Error> {
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const enabled =
    Boolean(opts?.enabled ?? true) && Boolean(csvContent && csvContent.trim());

  return useQuery<Product[], Error>({
    queryKey: ["productsFromFeedCsv", csvContent?.slice(0, 200) ?? null, limit],
    queryFn: async () => {
      if (!csvContent || typeof csvContent !== "string") return [];
      return parseCsvStringToProducts(csvContent, limit);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
