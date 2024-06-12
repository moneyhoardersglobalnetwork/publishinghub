"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { BookType } from "~~/types/types";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function BuyBook() {
  const [visible, setVisible] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("BookFactory");
  const [bookAddress, setBookAddress] = useState<string | undefined>(undefined);

  // const { nativeCurrencyPrice, setNativeCurrencyPrice } = useGlobalState();

  return (
    <>
      <div className="flex-columns justify-center flex-col items-center">
        <div className="flex-columns bg-[url('/assets/background.jpeg')] relative pb-10">
          <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
            <div>
              <div className={`mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>
                <div className="flex gap-5 bg-white bg-opacity-80 z-0 p-7 rounded-2xl shadow-lg">
                  <span className="text-3xl">👋🏻</span>
                  <div>
                    <div className="text-black">In this page you purchase new books.</div>
                    <div className="mt-2 text-black">
                      Great authors write great books. You can purchase them here and read them on the blockchain.
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-circle btn-ghost h-6 w-6 bg-base-200 bg-opacity-80 z-0 min-h-0 drop-shadow-md"
                  onClick={() => setVisible(false)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            In this area we want to display the books that are available for purchase. We will use the book factory
            contract to get the list of books available for purchase. We will use the IPFS hash of the book cover first
            to display the book covers here with mint buttons below cover. Then we link IPFS book PDF file CID to direct
            user to book file so they can read on read tab.
            <div className="flex flex-col mt-6 px-7 py-8 bg-white opacity-100 rounded-2xl shadow-lg border-2 border-primary">
              <form className="space-y-4">
                <span className="text-4xl sm:text-6xl text-black">Mint a new book</span>
                <input
                  type="text"
                  placeholder="Book Address"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setBookAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value Wei"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => e.target.value}
                />
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5"></div>

                <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                  <div className="flex rounded-full border-2 border-primary p-1">
                    <button
                      className="btn btn-primary uppercase"
                      onClick={async () => {
                        try {
                          {
                            await writeContractAsync({
                              functionName: "purchaseBookFromAddress",
                              args: [bookAddress],
                              value: BigInt(""),
                            });
                          }
                        } catch (err) {
                          console.error("Error calling execute function");
                        }
                      }}
                    >
                      Mint!
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="mt-4 flex gap-2 items-start">
              <span className="text-sm leading-tight">Price:</span>
              <div className="badge badge-warning">0.01 ETH + Gas</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
