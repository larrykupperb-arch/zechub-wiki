"use client";

import Image from "next/image";
import React from "react";
import {
  MdClose,
  MdCompareArrows,
  MdOutlineDifference,
} from "react-icons/md";
import { Icon } from "@/components/UI/Icon";
import {
  comparisonValuesDiffer,
  type WalletComparisonData,
} from "./walletComparison";

interface Props {
  wallets: WalletComparisonData[];
  likes: Record<string, number>;
  onRemove: (title: string) => void;
  onClear: () => void;
}

type Row = {
  label: string;
  value: (wallet: WalletComparisonData) => string | string[] | number;
  display?: (
    wallet: WalletComparisonData,
    value: string | string[] | number,
  ) => React.ReactNode;
};

const rows: Row[] = [
  { label: "Devices", value: (wallet) => wallet.devices },
  { label: "Operating systems", value: (wallet) => wallet.operatingSystem },
  { label: "Zcash pools", value: (wallet) => wallet.pools },
  { label: "Wallet support", value: (wallet) => wallet.walletSupport },
  { label: "Features", value: (wallet) => wallet.features },
  {
    label: "Ironwood readiness",
    value: (wallet) => wallet.ironwood || "Not listed",
  },
  {
    label: "Sync information",
    value: (wallet) => wallet.syncSpeed || "Not listed",
    display: (wallet) =>
      wallet.syncSpeed ? (
        <span className="inline-flex items-center gap-2">
          <Image
            src={wallet.syncSpeed}
            alt={`Sync information for ${wallet.title}`}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span>Indicator available</span>
        </span>
      ) : (
        "Not listed"
      ),
  },
  {
    label: "Community rating",
    value: (wallet) => wallet.title,
  },
];

const renderList = (value: string | string[] | number) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-slate-400">Not listed</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((item) => (
          <span
            key={item}
            className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  return value || <span className="text-slate-400">Not listed</span>;
};

const WalletComparison: React.FC<Props> = ({
  wallets,
  likes,
  onRemove,
  onClear,
}) => {
  const comparisonRows = rows.map((row) => {
    const values = wallets.map((wallet) =>
      row.label === "Community rating"
        ? likes[wallet.title] ?? 0
        : row.value(wallet),
    );

    return {
      ...row,
      values,
      differs: comparisonValuesDiffer(values),
    };
  });

  return (
    <section
      id="wallet-comparison"
      className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-label="Wallet comparison"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon={MdCompareArrows} size="medium" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Compare wallets
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {wallets.length < 2
              ? "Choose at least one more wallet. You can compare up to four."
              : "Rows marked Different highlight where the selected wallets do not match."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear comparison
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-max"
          style={{
            gridTemplateColumns: `minmax(165px, 0.8fr) repeat(${wallets.length}, minmax(220px, 1fr))`,
          }}
        >
          <div className="border-b border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Attribute
            </span>
          </div>

          {wallets.map((wallet) => (
            <div
              key={wallet.title}
              className="border-b border-r border-slate-200 p-4 last:border-r-0 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {wallet.imageUrl ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={wallet.imageUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-800 dark:text-slate-100">
                      {wallet.title}
                    </div>
                    <a
                      href={wallet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:underline dark:text-sky-400"
                    >
                      Open wallet site
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(wallet.title)}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={`Remove ${wallet.title} from comparison`}
                >
                  <Icon icon={MdClose} size="small" />
                </button>
              </div>
            </div>
          ))}

          {comparisonRows.map((row) => (
            <React.Fragment key={row.label}>
              <div
                className={`border-b border-r border-slate-200 p-4 text-sm font-semibold dark:border-slate-700 ${
                  row.differs
                    ? "bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                    : "bg-slate-50 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span>{row.label}</span>
                  {row.differs ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      <Icon icon={MdOutlineDifference} size="small" />
                      Different
                    </span>
                  ) : null}
                </div>
              </div>

              {wallets.map((wallet, index) => {
                const value = row.values[index];
                const rendered =
                  row.label === "Community rating"
                    ? `${likes[wallet.title] ?? 0}`
                    : row.display
                      ? row.display(wallet, value)
                      : renderList(value);

                return (
                  <div
                    key={`${row.label}-${wallet.title}`}
                    className={`border-b border-r border-slate-200 p-4 text-sm text-slate-700 last:border-r-0 dark:border-slate-700 dark:text-slate-200 ${
                      row.differs
                        ? "bg-amber-50/50 dark:bg-amber-950/10"
                        : ""
                    }`}
                  >
                    {rendered}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WalletComparison;
