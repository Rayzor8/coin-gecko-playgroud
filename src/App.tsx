import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
import { Coinlists } from "./types";
import axios from "axios";
import CoinSummary from "./components/CoinSummary";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

function App() {
  const [coins, setCoins] = useState<Coinlists[] | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coinlists | undefined>();
  const [range, setRange] = useState<number>(30);
  const [chartData, setChartData] = useState<ChartData<"line">>();
  const [chartOptions, setChartOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });
 
  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await axios(URL);

      setCoins(data);
    };
    fetchCoins();
  }, []);

  useEffect(() => { 
    // do if selectedCoin undefined else return
    if(selectedCoin === undefined) return
    const CHART_URL = `https://api.coingecko.com/api/v3/coins/${selectedCoin?.id}/market_chart?vs_currency=usd&days=${range}&interval=${range === 1 ? 'hourly' : 'daily'}`;

    const fetchChartData = async () => {
      const { data } = await axios.get(CHART_URL);
      setChartData({
        labels: data.prices.map((price: number[]) =>
          moment(price[0]).format(range !== 1 ? "MMM Do" : 'LT')
        ),
        datasets: [
          {
            label: selectedCoin?.name,
            data: data.prices.map((price: number[]) => price[1]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });

      setChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: `${selectedCoin?.name} per ${range} ${range === 1 ? 'day' : 'days'}`,
          },
        },
      })
    };
    fetchChartData();
  }, [selectedCoin, range]);

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const findCoin = coins?.find((coin) => coin.id === e.target.value);
    setSelectedCoin(findCoin);
  }

  return (
    <div className="App">
      <main>
        <select onChange={handleSelect} defaultValue="default">
          <option value="default">Choose coin list</option>
          {coins?.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => setRange(Number(e.target.value))}>
          <option value={30}>30 days</option>
          <option value={7}>7 days</option>
          <option value={1}>1 day</option>
        </select>

        {selectedCoin && <CoinSummary coin={selectedCoin} />}
        {chartData && (
          <div style={{ maxWidth: "800px" }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
