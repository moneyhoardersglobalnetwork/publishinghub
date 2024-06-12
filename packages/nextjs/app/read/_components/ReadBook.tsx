/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
//import { TransactionReceipt } from "viem";
import { XMarkIcon } from "@heroicons/react/24/outline";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { storeOnIPFS } from "~~/hooks/helper/nftStorageHelper";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/* eslint-disable @typescript-eslint/no-unused-vars */
export function ReadBook() {
  const [visible, setVisible] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("BookFactory");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [setBookIpfsCidAsync, ipfsCidMining] = useState<string>("");
  // const [bookAddress, setBookAddress] = useState<any>(null);

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
                    <div className="text-black">You can interact with you book collection here</div>
                    <div className="mt-2 text-black">
                      Great authors write great books. You can purchase them here and read all stored on the blockchain.
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

            <div className="flex flex-col mt-6 px-7 py-8 bg-white opacity-100 rounded-2xl shadow-lg border-2 border-primary">
              <form className="space-y-4">
                <span className="text-4xl sm:text-6xl text-black">Access your collection</span>
                <input
                  type="text"
                  placeholder="Book Title"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => e.target.value}
                />
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
                  <input
                    type="text"
                    placeholder="Book Description"
                    className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                    onChange={e => e.target.value}
                  />
                  <input
                    type="text"
                    placeholder="Book Symbol"
                    className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                    onChange={e => e.target.value}
                  />
                </div>

                <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                  <div className="flex rounded-full border-2 border-primary p-1">
                    <button
                      className="btn btn-primary uppercase"
                      onClick={async () => {
                        try {
                          {
                            await writeContractAsync({
                              functionName: "setBookIpfsCid",
                              args: ["bookTitle", "bookSymbol"],
                            });
                          }
                        } catch (err) {
                          console.error("Error calling execute function");
                        }
                      }}
                    >
                      Publish!
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
