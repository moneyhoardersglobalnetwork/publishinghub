import { PublishBook } from "./_components/PublishBook";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Publish",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Publish: NextPage = () => {
  return (
    <>
      <PublishBook />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Publishing Hub</h1>
        <p className="text-neutral">Tokenize your work!</p>
      </div>
    </>
  );
};

export default Publish;
