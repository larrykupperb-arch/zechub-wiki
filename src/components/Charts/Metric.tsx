import { useInMobile } from "@/hooks/useInMobile";
import { useLanguage } from "@/context/LanguageContext";
import {
  formatDashboardCurrency,
  getDashboardCurrency,
} from "@/lib/dashboardCurrency";
import { useEffect, useState } from "react";
import {
  MetricCard,
  MetricCardSkeleton,
} from "./Zcash/ZcashMetrics/MetricCard";

interface BlockchainInfo {
  market_cap_fiat: number;
  market_price_fiat: number;
  market_price_btc: number;
  blocks: number;
  transactions_24h: number;
}

const CryptoMetrics = ({ selectedCoin }: { selectedCoin: string }) => {
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>({
    market_cap_fiat: 0,
    market_price_fiat: 0,
    market_price_btc: 0,
    blocks: Math.floor(Math.random() * 2000000),
    transactions_24h: 0,
  });
  const [circulation, setCirculation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useInMobile();
  const { locale } = useLanguage();
  const { code: fiatCode } = getDashboardCurrency(locale);
  const fiatKey = fiatCode.toLowerCase();

  useEffect(() => {
    let name = selectedCoin;
    const fetchCoinData = async () => {
      // Skip fetch for Namada and Zcash (or handle differently)
      if (selectedCoin === "Zcash") {
        setLoading(false);
        return;
      }

      if (selectedCoin === "Atom") {
        name = "Cosmos Hub";
      } else if (selectedCoin === "Tia") {
        name = "Celestia";
      } else if (selectedCoin === "Osmo") {
        name = "Osmosis";
      } else if (selectedCoin === "stOsmo") {
        name = "Stride Staked Osmo";
      } else if (selectedCoin === "stTia") {
        name = "Stride Staked TIA";
      } else if (selectedCoin === "stAtom") {
        name = "Stride Staked Atom";
      } else if (selectedCoin === "Um") {
        name = "Penumbra";
      } else if (selectedCoin === "Ntrn") {
        name = "Neutron";
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch price data via the same-origin proxy (keeps the CoinGecko key
        // server-side and the visitor's browser off api.coingecko.com).
        const response = await fetch(
          `/api/prices/simple?vs_currencies=${encodeURIComponent(
            `${fiatKey},btc`
          )}&names=${encodeURIComponent(
            name.toLowerCase()
          )}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();

        if (name == "Usdc") {
          name = "USDC";
        }
        const coinInfo = data[name];
        // setCoinData(coinInfo);

        // Mock blockchain data (replace with actual API calls)
        const fiatMarketCap = coinInfo?.[`${fiatKey}_market_cap`] || 0;
        const fiatPrice = coinInfo?.[fiatKey] || 0;

        setBlockchainInfo({
          market_cap_fiat: fiatMarketCap,
          market_price_fiat: fiatPrice,
          market_price_btc: coinInfo?.btc || 0,
          blocks: Math.floor(Math.random() * 2000000),
          transactions_24h: coinInfo?.[`${fiatKey}_24h_vol`] || 0,
        });

        setCirculation(
          Math.floor(fiatMarketCap && fiatPrice ? fiatMarketCap / fiatPrice : 0)
        );
      } catch (err) {
        console.error("Failed to fetch coin data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [selectedCoin, fiatKey]);

  const metricsObj = [
    {
      label: "Market Cap",
      value: blockchainInfo?.market_cap_fiat
        ? formatDashboardCurrency(blockchainInfo.market_cap_fiat, locale, {
            maximumFractionDigits: 0,
          })
        : "N/A",
    },
    {
      label: "Circulation",
      value: circulation
        ? `${circulation?.toLocaleString()}  ${selectedCoin}`
        : "N/A",
    },
    {
      label: `Market Price (${fiatCode})`,
      value: blockchainInfo?.market_price_fiat
        ? formatDashboardCurrency(blockchainInfo.market_price_fiat, locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits:
              blockchainInfo.market_price_fiat < 1 ? 4 : 2,
          })
        : "N/A",
    },
    {
      label: "Market Price (BTC)",
      value: blockchainInfo?.market_price_btc
        ? isMobile
          ? Number(blockchainInfo?.market_price_btc).toFixed(4)
          : Number(blockchainInfo?.market_price_btc).toFixed(8)
        : "N/A",
    },
    {
      label: "Blocks",
      value: blockchainInfo?.blocks
        ? blockchainInfo?.blocks.toLocaleString()
        : "N/A",
    },
    {
      label: "24h Transactions",
      value: Number(blockchainInfo?.transactions_24h)
        ? blockchainInfo?.transactions_24h.toLocaleString()
        : "N/A",
    },
  ];

  return (
    <div className="my-12">
      <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
        {loading ? (
          <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2" />
        ) : (
          `${selectedCoin} Metrics`
        )}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {loading
          ? metricsObj.map(({ label, value }) => (
              <MetricCardSkeleton key={label} />
            ))
          : metricsObj.map(({ label, value }) => (
              <MetricCard label={label} value={value!} key={label} />
            ))}
      </div>
      {error && (
        <p className="flex items-center bg-red-300 text-red-400 mt-8 p-4">
          Error loading {selectedCoin} chart.
        </p>
      )}
    </div>
  );
};

export default CryptoMetrics;
