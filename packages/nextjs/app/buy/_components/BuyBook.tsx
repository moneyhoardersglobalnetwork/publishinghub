/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  useScaffoldContract,
  useScaffoldEventHistory,
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

export function BuyBook() {
  const [visible, setVisible] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("PublishingFactoryUsdc");

  const [bookAddress, setBookAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [fileCid, setFileCid] = useState("");
  const [coverCid, setCoverCid] = useState("");

  const { address } = useAccount();

  const { data: publishedAssetAddresses } = useScaffoldReadContract({
    contractName: "PublishingFactoryUsdc",
    functionName: "getAllBookAddresses",
  });

  const { data: assetsPublishedWithNative } = useScaffoldReadContract({
    contractName: "PublishingFactoryNative",
    functionName: "getAllBookAddresses",
  });

  const handleViewBook = async () => {
    try {
      const fileCidResult = await useScaffoldReadContract({
        contractName: "PublishingFactoryUsdc",
        functionName: "getBookIpfsCid",
        args: [bookAddress],
      });
      setFileCid(fileCidResult.data || "");

      const coverCidResult = await useScaffoldReadContract({
        contractName: "PublishingFactoryUsdc",
        functionName: "getBookIpfsCoverCid",
        args: [bookAddress],
      });
      setCoverCid(coverCidResult.data || "");
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  return (
    <>
      <div className="flex-columns justify-center flex-col items-center">
        <div className="flex-columns bg-[url('/assets/background.jpeg')] relative pb-10">
          <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
            <div>
              <div className={`mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>{/* ... */}</div>
            </div>

            <div className="text-2xl text-white text-right min-w-[3rem] px-2 py-1 flex justify-left font-bai-jamjuree">
              <div className="p-2 py-1 border-r border-primary flex items-center justify-center w-min text-white">
                Assets Published with USDC
              </div>
              {publishedAssetAddresses?.toString() || "0"}
            </div>
            <div className="text-2xl text-white text-right min-w-[3rem] px-2 py-1 flex justify-left font-bai-jamjuree">
              <div className="p-2 py-1 border-r border-primary flex items-center justify-center w-min text-white">
                Assets Published with Native
              </div>
              {assetsPublishedWithNative?.toString() || "No Assets Published"}
            </div>
            <div className="flex flex-col mt-6 px-7 py-8 bg-white opacity-100 rounded-2xl shadow-lg border-2 border-primary">
              <form className="space-y-4">
                <span className="text-4xl sm:text-6xl text-black">Purchase listed Assets</span>
                <input
                  type="text"
                  placeholder="Asset Address"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setBookAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Token ID"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setTokenId(e.target.value)}
                />
                <button className="btn btn-primary uppercase" onClick={handleViewBook}>
                  View Book
                </button>
              </form>
            </div>

            {fileCid && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">Book File</h2>
                <a href={`https://ipfs.io/ipfs/${fileCid}`} target="_blank" rel="noopener noreferrer">
                  <Image src={`https://ipfs.io/ipfs/${fileCid}`} alt="Book File" width={400} height={400} />
                </a>
              </div>
            )}

            {coverCid && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">Book Cover</h2>
                <a href={`https://ipfs.io/ipfs/${coverCid}`} target="_blank" rel="noopener noreferrer">
                  <Image src={`https://ipfs.io/ipfs/${coverCid}`} alt="Book Cover" width={200} height={300} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
