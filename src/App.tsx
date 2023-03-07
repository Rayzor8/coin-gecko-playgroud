import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
import { Coinlists } from "./types";
import axios from "axios";
import CoinSummary from "./components/CoinSummary";

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

function App() {
  const [coins, setCoins] = useState<Coinlists[] | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coinlists | undefined>();

  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await axios(URL);

      setCoins(data);
    };

    fetchCoins();
  }, []);

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const findCoin = coins?.find((coin) => coin.id === e.target.value);
    console.log(findCoin);
    setSelectedCoin(findCoin);
  }

  return (
    <div className="App">
      <main>
        {/* {coins?.map(coin => <CoinSummary key={coin.id} coin={coin}/>)} */}

        <select onChange={handleSelect} defaultValue="default">
          <option value="default">Choose coin list</option>
          {coins?.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
        {selectedCoin && <CoinSummary coin={selectedCoin} />}
      </main>
    </div>
  );
}

export default App;
