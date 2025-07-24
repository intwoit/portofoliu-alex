// App.js – reparat extragerea datelor din API
import React, { useEffect, useState } from 'react';
import investments from './data';
import './index.css';

function App() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
  fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,chainlink,solana,fetch-ai,sei-network,render-token,lido-dao,gmx,starknet,radiant-capital,renzo,ether-fi,pendle&vs_currencies=usd'
)




      .then((res) => res.json())
      .then((data) => {
        console.log("API Data:", data); // pentru debugging
        const formatted = {
  BTC: data["bitcoin"]?.usd ?? 0,
  ETH: data["ethereum"]?.usd ?? 0,
  LINK: data["chainlink"]?.usd ?? 0,
  SOL: data["solana"]?.usd ?? 0,
  FET: data["fetch-ai"]?.usd ?? 0,
  SEI: data["sei-network"]?.usd ?? 0,
  RNDR: data["render-token"]?.usd ?? 0,
  LDO: data["lido-dao"]?.usd ?? 0,
  GMX: data["gmx"]?.usd ?? 0,
  STRK: data["starknet"]?.usd ?? 0,
  RDNT: data["radiant-capital"]?.usd ?? 0,
  REZ: data["renzo"]?.usd ?? 0,
  ETHFI: data["ether-fi"]?.usd ?? 0,
  PENDLE: data["pendle"]?.usd ?? 0,
};

        setPrices(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch prices:', err);
        setLoading(false);
      });
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
        <h2 className="text-2xl mb-4 text-cyan-400">Private Access</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-cyan-500 mb-4 text-white"
        />
        <button
          onClick={() => {
            if (passwordInput === 'alex2025') {
              setAuthenticated(true);
            } else {
              alert('Wrong password');
            }
          }}
          className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-cyan-400"
        >
          Enter
        </button>
      </div>
    );
  }

  const processedData = investments.map((inv) => {
    const totalInvestment = inv.entries.reduce((sum, e) => sum + e.amount * e.price, 0);
    const totalAmount = inv.entries.reduce((sum, e) => sum + e.amount, 0);
    const avgPrice = totalAmount > 0 ? totalInvestment / totalAmount : 0;
    const livePrice = prices[inv.asset] ?? 0;
    const value = totalAmount * livePrice;
    const pnl = avgPrice > 0 ? ((livePrice - avgPrice) / avgPrice) * 100 : 0;

    return {
      asset: inv.asset,
      investment: totalInvestment,
      averagePrice: avgPrice,
      amount: totalAmount,
      livePrice,
      value,
      pnl,
    };
  });

  const totalValue = processedData.reduce((sum, item) => sum + item.value, 0);
  const totalInvestment = processedData.reduce((sum, item) => sum + item.investment, 0);
  const totalProfit = totalValue - totalInvestment;

  const format = (val, decimals = 2) => Number(val).toFixed(decimals);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-gray-800 text-white p-6 font-mono">
      <h1 className="text-3xl text-cyan-400 font-bold mb-8 border-b border-cyan-700 pb-2">
        Alex Crypto Tracker
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-cyan-700 text-left">
          <thead className="bg-cyan-900 text-cyan-200">
            <tr>
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2">Investment</th>
              <th className="px-4 py-2">Average Price</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Live Price</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">P/L (%)</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((coin) => (
              <tr key={coin.asset} className="border-b border-cyan-800 hover:bg-gray-800">
                <td className="px-4 py-2 font-bold text-cyan-300">{coin.asset}</td>
                <td className="px-4 py-2">${format(coin.investment)}</td>
                <td className="px-4 py-2">${format(coin.averagePrice, 4)}</td>
                <td className="px-4 py-2">{format(coin.amount, 5)}</td>
                <td className="px-4 py-2">{loading ? 'Loading...' : `$${format(coin.livePrice, 4)}`}</td>
                <td className="px-4 py-2">${format(coin.value)}</td>
                <td className={`px-4 py-2 ${coin.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {format(coin.pnl)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-cyan-300">
        <p>Total Investment: ${format(totalInvestment)}</p>
        <p>Total Value: ${format(totalValue)}</p>
<p style={{ color: totalProfit >= 0 ? "limegreen" : "crimson" }}>
  Total P/L: ${format(totalProfit)} ({((totalProfit / totalInvestment) * 100).toFixed(2)}%)
</p>

        <p>Cash reserved for dips: $9648</p>
      </div>
    </div>
  );
}

export default App;

