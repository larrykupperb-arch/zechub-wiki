"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import WalletComparison from "./WalletComparison";
import {
  MAX_COMPARE_WALLETS,
  buildComparisonSearch,
  readComparisonSelection,
  type WalletComparisonData,
} from "./walletComparison";

interface ComparisonContextValue {
  enabled: boolean;
  selectedTitles: string[];
  isFull: boolean;
  isSelected: (title: string) => boolean;
  toggle: (title: string) => void;
  reportRating: (title: string, rating: number) => void;
}

const fallbackContext: ComparisonContextValue = {
  enabled: false,
  selectedTitles: [],
  isFull: false,
  isSelected: () => false,
  toggle: () => undefined,
  reportRating: () => undefined,
};

const WalletComparisonContext =
  createContext<ComparisonContextValue>(fallbackContext);

export const useWalletComparison = () => useContext(WalletComparisonContext);

interface Props {
  wallets: WalletComparisonData[];
  children: React.ReactNode;
}

const WalletComparisonProvider: React.FC<Props> = ({ wallets, children }) => {
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSelectedTitles(
      readComparisonSelection(
        window.location.search,
        wallets.map((wallet) => wallet.title),
      ),
    );
  }, [wallets]);

  const applySelection = useCallback((nextTitles: string[]) => {
    const next = nextTitles.slice(0, MAX_COMPARE_WALLETS);
    setSelectedTitles(next);

    if (typeof window === "undefined") return;

    const search = buildComparisonSearch(window.location.search, next);
    const nextUrl = `${window.location.pathname}${search}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  const toggle = useCallback(
    (title: string) => {
      if (selectedTitles.includes(title)) {
        applySelection(selectedTitles.filter((item) => item !== title));
        return;
      }

      if (selectedTitles.length >= MAX_COMPARE_WALLETS) return;
      applySelection([...selectedTitles, title]);
    },
    [applySelection, selectedTitles],
  );

  const reportRating = useCallback((title: string, rating: number) => {
    setRatings((current) => {
      if (current[title] === rating) return current;
      return { ...current, [title]: rating };
    });
  }, []);

  const selectedWallets = useMemo(
    () =>
      selectedTitles
        .map((title) => wallets.find((wallet) => wallet.title === title))
        .filter((wallet): wallet is WalletComparisonData => Boolean(wallet)),
    [selectedTitles, wallets],
  );

  const contextValue = useMemo<ComparisonContextValue>(
    () => ({
      enabled: true,
      selectedTitles,
      isFull: selectedTitles.length >= MAX_COMPARE_WALLETS,
      isSelected: (title: string) => selectedTitles.includes(title),
      toggle,
      reportRating,
    }),
    [reportRating, selectedTitles, toggle],
  );

  return (
    <WalletComparisonContext.Provider value={contextValue}>
      {selectedWallets.length > 0 ? (
        <WalletComparison
          wallets={selectedWallets}
          likes={ratings}
          onRemove={(title) =>
            applySelection(selectedTitles.filter((item) => item !== title))
          }
          onClear={() => applySelection([])}
        />
      ) : null}

      {children}

      {selectedWallets.length > 0 ? (
        <div
          className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
          aria-live="polite"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Compare {selectedTitles.length}/{MAX_COMPARE_WALLETS}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTitles.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => toggle(title)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    aria-label={`Remove ${title} from comparison`}
                  >
                    {title} <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            </div>
            <a
              href="#wallet-comparison"
              className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {selectedTitles.length < 2
                ? "Choose one more wallet"
                : "View comparison"}
            </a>
          </div>
        </div>
      ) : null}
    </WalletComparisonContext.Provider>
  );
};

export default WalletComparisonProvider;
