export type DashboardCurrency = {
  code: string;
  intlLocale: string;
};

/**
 * Dashboard fiat preference derived from the active UI language.
 *
 * The language selector is the source of truth, so switching locales updates
 * dashboard fiat values without introducing a second currency preference.
 * Regions follow the locale flags used by LanguageContext (for example pt uses
 * Brazil, ar uses Saudi Arabia, sw uses Kenya).
 */
const DASHBOARD_CURRENCY_BY_LOCALE: Record<string, DashboardCurrency> = {
  en: { code: "USD", intlLocale: "en-US" },
  es: { code: "EUR", intlLocale: "es-ES" },
  fr: { code: "EUR", intlLocale: "fr-FR" },
  de: { code: "EUR", intlLocale: "de-DE" },
  it: { code: "EUR", intlLocale: "it-IT" },
  pt: { code: "BRL", intlLocale: "pt-BR" },
  ar: { code: "SAR", intlLocale: "ar-SA" },
  zh: { code: "CNY", intlLocale: "zh-CN" },
  hi: { code: "INR", intlLocale: "hi-IN" },
  ru: { code: "RUB", intlLocale: "ru-RU" },
  ja: { code: "JPY", intlLocale: "ja-JP" },
  ko: { code: "KRW", intlLocale: "ko-KR" },
  tr: { code: "TRY", intlLocale: "tr-TR" },
  uk: { code: "UAH", intlLocale: "uk-UA" },
  sw: { code: "KES", intlLocale: "sw-KE" },
  yo: { code: "NGN", intlLocale: "yo-NG" },
  ig: { code: "NGN", intlLocale: "ig-NG" },
  ak: { code: "GHS", intlLocale: "ak-GH" },
  ee: { code: "GHS", intlLocale: "ee-GH" },
};

export const SUPPORTED_DASHBOARD_FIAT = [
  ...new Set(Object.values(DASHBOARD_CURRENCY_BY_LOCALE).map(({ code }) => code.toLowerCase())),
] as const;

export function getDashboardCurrency(locale: string): DashboardCurrency {
  const normalized = (locale || "en").toLowerCase().split(/[-_]/)[0];
  return DASHBOARD_CURRENCY_BY_LOCALE[normalized] ?? DASHBOARD_CURRENCY_BY_LOCALE.en;
}

export function formatDashboardCurrency(
  value: number,
  locale: string,
  options: { maximumFractionDigits?: number; minimumFractionDigits?: number } = {},
): string {
  const { code, intlLocale } = getDashboardCurrency(locale);
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: code,
    ...options,
  }).format(value);
}

export function replaceUsdLabel(label: string, currencyCode: string): string {
  return /USD/i.test(label)
    ? label.replace(/USD/gi, currencyCode)
    : `${label} (${currencyCode})`;
}
