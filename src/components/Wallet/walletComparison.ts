export const MAX_COMPARE_WALLETS = 4;

export interface WalletComparisonData {
  title: string;
  url: string;
  imageUrl: string;
  devices: string[];
  pools: string[];
  features: string[];
  operatingSystem: string[];
  walletSupport: string[];
  syncSpeed: string;
  ironwood: string;
}

const cleanSearch = (search: string) =>
  search.startsWith("?") ? search.slice(1) : search;

export function readComparisonSelection(
  search: string,
  availableTitles: Iterable<string>,
): string[] {
  const available = new Set(availableTitles);
  const params = new URLSearchParams(cleanSearch(search));
  const selected: string[] = [];

  for (const raw of params.getAll("compare")) {
    for (const title of raw.split(",")) {
      const value = title.trim();
      if (
        value &&
        available.has(value) &&
        !selected.includes(value) &&
        selected.length < MAX_COMPARE_WALLETS
      ) {
        selected.push(value);
      }
    }
  }

  return selected;
}

export function buildComparisonSearch(
  search: string,
  selectedTitles: string[],
): string {
  const params = new URLSearchParams(cleanSearch(search));
  params.delete("compare");

  for (const title of selectedTitles.slice(0, MAX_COMPARE_WALLETS)) {
    if (title.trim()) params.append("compare", title);
  }

  const next = params.toString();
  return next ? `?${next}` : "";
}

export function normalizeComparisonValue(value: string | string[] | number) {
  if (Array.isArray(value)) {
    return [...value]
      .map((item) => item.trim().toLocaleLowerCase())
      .filter(Boolean)
      .sort()
      .join("|");
  }

  return String(value).trim().toLocaleLowerCase();
}

export function comparisonValuesDiffer(
  values: Array<string | string[] | number>,
): boolean {
  if (values.length < 2) return false;
  return new Set(values.map(normalizeComparisonValue)).size > 1;
}
