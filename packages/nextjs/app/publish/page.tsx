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
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <span className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </span>{" "}
        </p>
      </div>
    </>
  );
};

export default Publish;
