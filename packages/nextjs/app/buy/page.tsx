import { BuyBook } from "./_components/BuyBook";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Buy",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Buy: NextPage = () => {
  return (
    <>
      <BuyBook />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Join the BookHub</h1>
        <p className="text-neutral">
          If you enjoy reading books, you can purchase one on this page and join the BookHub.
        </p>
      </div>
    </>
  );
};

export default Buy;
