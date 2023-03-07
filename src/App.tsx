import "./App.css";
import { useEffect, useState } from "react";
import { Coinlists } from "./types";
import axios from "axios";
import CoinSummary from "./components/CoinSummary";

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

function App() {
  const [coins, setCoins] = useState<Coinlists[] | null>(null);
  
  useEffect(() => {
    const fetchCoins = async () => {
      const {data} = await axios(URL);
      
      setCoins(data)
    };

    fetchCoins()
  }, []);


  return (
    <div className="App">
      <main>
         {coins?.map(coin => <CoinSummary key={coin.id} {...coin}/>)}
      </main>
    </div>
  );
}

export default App;
