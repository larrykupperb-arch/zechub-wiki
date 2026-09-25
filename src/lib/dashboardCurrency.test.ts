import {
  formatDashboardCurrency,
  getDashboardCurrency,
  replaceUsdLabel,
  SUPPORTED_DASHBOARD_FIAT,
} from "./dashboardCurrency";

describe("dashboard currency by locale", () => {
  test.each([
    ["en", "USD"],
    ["fr", "EUR"],
    ["de-DE", "EUR"],
    ["pt", "BRL"],
    ["ar", "SAR"],
    ["zh", "CNY"],
    ["hi", "INR"],
    ["ja", "JPY"],
    ["ko", "KRW"],
    ["tr", "TRY"],
    ["uk", "UAH"],
    ["sw", "KES"],
    ["yo", "NGN"],
    ["ig", "NGN"],
    ["ak", "GHS"],
    ["ee", "GHS"],
  ])("%s maps to %s", (locale, currency) => {
    expect(getDashboardCurrency(locale).code).toBe(currency);
  });

  it("falls back to USD for an unknown locale", () => {
    expect(getDashboardCurrency("xx").code).toBe("USD");
  });

  it("formats with the locale-specific fiat currency", () => {
    expect(formatDashboardCurrency(1234.5, "en")).toContain("$");
    expect(formatDashboardCurrency(1234.5, "fr")).toMatch(/€|EUR/);
  });

  it("relabels existing translated USD labels without losing translated text", () => {
    expect(replaceUsdLabel("Market Price (USD)", "EUR")).toBe("Market Price (EUR)");
    expect(replaceUsdLabel("Prix (USD)", "EUR")).toBe("Prix (EUR)");
  });

  it("exports every fiat code used by the language map", () => {
    expect(SUPPORTED_DASHBOARD_FIAT).toEqual(
      expect.arrayContaining(["usd", "eur", "brl", "sar", "cny", "inr", "rub", "jpy", "krw", "try", "uah", "kes", "ngn", "ghs"]),
    );
  });
});
