import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transactions.query";

import Card from "./Card";

const Cards = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">Histórico</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading &&
          data.transactions.map((transaction) => (
            <Card key={transaction._id} transaction={transaction} />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="text-2xl font-bold text-center w-full">
          Nenhum histórico de transações encontrado.
        </p>
      )}
    </div>
  );
};
export default Cards;
