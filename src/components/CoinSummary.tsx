import { Coinlists } from "../types";

const CoinSummary = (props: Coinlists) => {
  const { name, current_price } = props;
  return <p>{`${name} --- ${current_price}`}</p>;
};

export default CoinSummary;
