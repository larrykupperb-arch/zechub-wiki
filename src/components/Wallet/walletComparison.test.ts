import {
  MAX_COMPARE_WALLETS,
  buildComparisonSearch,
  comparisonValuesDiffer,
  readComparisonSelection,
} from "./walletComparison";

describe("wallet comparison URL state", () => {
  const titles = ["ZODL", "Ywallet", "Zingo!", "Cake", "Zallet"];

  test("reads valid repeated compare params, de-duplicates, and caps at four", () => {
    expect(
      readComparisonSelection(
        "?compare=ZODL&compare=Ywallet&compare=ZODL&compare=Zingo%21&compare=Cake&compare=Zallet",
        titles,
      ),
    ).toEqual(["ZODL", "Ywallet", "Zingo!", "Cake"]);
    expect(MAX_COMPARE_WALLETS).toBe(4);
  });

  test("ignores wallets that are not in the current dataset", () => {
    expect(
      readComparisonSelection(
        "?compare=ZODL&compare=Made%20Up%20Wallet",
        titles,
      ),
    ).toEqual(["ZODL"]);
  });

  test("supports comma-separated legacy or hand-written compare values", () => {
    expect(
      readComparisonSelection("?compare=ZODL%2CYwallet", titles),
    ).toEqual(["ZODL", "Ywallet"]);
  });

  test("writes shareable comparison params while preserving unrelated query state", () => {
    expect(
      buildComparisonSearch("?ref=guide&compare=Old", ["ZODL", "Ywallet"]),
    ).toBe("?ref=guide&compare=ZODL&compare=Ywallet");
  });
});

describe("wallet comparison differences", () => {
  test("treats array order as irrelevant", () => {
    expect(
      comparisonValuesDiffer([
        ["Android", "iOS"],
        ["iOS", "Android"],
      ]),
    ).toBe(false);
  });

  test("detects materially different values", () => {
    expect(
      comparisonValuesDiffer([
        ["Sapling", "Ironwood"],
        ["Transparent", "Ironwood"],
      ]),
    ).toBe(true);
  });
});
