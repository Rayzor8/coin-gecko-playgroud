import { Coinlists } from "../types";

type PropsTypes = {
  coin: Coinlists;
};

const CoinSummary = ({ coin }: PropsTypes) => {
  const { name, current_price } = coin;
  return <p>{`${name} --- $${current_price}`}</p>;
};

export default CoinSummary;
