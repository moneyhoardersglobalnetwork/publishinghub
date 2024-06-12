"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
//import { create } from "@web3-storage/w3up-client";
//import { TransactionReceipt } from "viem";
import { XMarkIcon } from "@heroicons/react/24/outline";
//import Lit from "~~/hooks/helper/lit";
import { storeOnIPFS } from "~~/hooks/helper/nftStorageHelper";
import { useNativeCurrencyPrice, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";


export function PublishBook() {
  const [visible, setVisible] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("BookFactory");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookCover, setBookCover] = useState<File | null>(null);
  const [bookName, setBookName] = useState<string>("");
  const [bookDescription, setBookDescription] = useState<string>("");
  const [bookPrice, setBookPrice] = useState<number>(0);
  const [bookPriceInEth, setBookPriceInEth] = useState<bigint>(BigInt(0));
  const [bookURI, setBookURI] = useState<string>("");
  const [bookSymbol, setBookSymbol] = useState<string>("");
  const [coverURL, setCoverURL] = useState<string>("");
  const [bookIsPublishing, setBookIsPublishing] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookContractAddress, setBookContractAddress] = useState<string>("");
  const [encryptedBookCid, setEncryptedBookCid] = useState<string>("this is a test cid");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [setBookIpfsCid, ipfsCidMining] = useState<string>("");
  // const [bookAddress, setBookAddress] = useState<any>(null);

  const nativeCurrencyPrice: number = useNativeCurrencyPrice(); // ETH in USD

  // const { nativeCurrencyPrice, setNativeCurrencyPrice } = useGlobalState();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookIsPublishing(true);

    if (!bookFile || !bookName || !bookDescription) {
      alert("All fields are required");
      setBookIsPublishing(false);
      return;
    }

    if (bookCover) {
      try {
        //------------------------------------Step 1-----------------------------------------------------------
        // First I am setting the book Cover with its' metadata
        const coverIPFSURL = await storeOnIPFS(bookCover, bookName, bookDescription, bookSymbol, String(bookPrice));
        setBookURI(coverIPFSURL);
        console.log("bookURI is -> ", coverIPFSURL);
        alert(
          `Your cover has been uploaded. Cover IPFS URL -> ${coverIPFSURL},  Book name -> ${bookName}, Book description -> ${bookDescription}`,
        );
        //------------------------------------Step 2------------------------------------------------------------
        // Than I am creating a book in the form of the NFT and pinning baseURI to the NFT
        console.log("book price in ETH converted to bigint", bookPriceInEth);
        console.log("Arguments being passed to createBooAsync", [bookName, bookSymbol, bookPriceInEth, coverIPFSURL]);

        await writeContractAsync({
          functionName: "createBook",
          args: [bookName, bookSymbol, bookPriceInEth, coverIPFSURL],
        });

        setBookIsPublishing(false);
      } catch (error) {
        setBookIsPublishing(false);
        console.error("An error occurred while creating the book:", error);
        alert("An error occurred. Please check the console for details.");
      }
    } else {
      alert("Cover file is required");
      setBookIsPublishing(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateIpfsCid = async () => {
    console.log("encryptedBookCid is -> ", encryptedBookCid);
    //---------------------------------------Step 4---------------------------------------------------------
    // than I will update the created book with the ipfsCid of the encrypted book
    if (encryptedBookCid === "") {
      alert("Please get the ipfsCid of the encrypted book first");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "setBookIpfsCid",
        args: [bookContractAddress, encryptedBookCid],
      });
    } catch (error) {
      if (error instanceof Error) {
        // Now TypeScript knows that `error` is an instance of `Error`
        console.error("An error occurred while updating the book's ipfsCid:", error);
        alert("An error occurred. Please check the console for details.");
        throw new Error("An error occurred while updating the book's ipfsCid: " + error.message);
      } else {
        // Handle other types of errors or re-throw them
        throw error;
      }
    }
  };

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = event.target.files?.[0];
    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("application/pdf")) {
        // Modify according to your valid mime types for books
        setBookFile(file);
      } else {
        setBookFile(null);
        fileInput.value = "";
        console.log("Invalid book file type.");
        alert("Invalid book file type. Please upload a PDF.");
        // Show some error message to the user if you like
      }
    }
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = event.target.files?.[0];
    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("image/jpg") || mimeType.startsWith("image/jpeg") || mimeType.startsWith("image/png")) {
        setBookCover(file);
        const url = URL.createObjectURL(file);
        setCoverURL(url); // Update state
        console.log("File name: ", file.name);
      } else {
        setBookCover(null);
        fileInput.value = "";
        console.log("Invalid cover file type.");
        alert("Invalid cover file type. Please upload a JPG, JPEG, or PNG image.");
        // Show some error message to the user if you like
      }
    }
  };

  useEffect(() => {
    if (nativeCurrencyPrice > 0) {
      const tempBookPriceInEth = (bookPrice / nativeCurrencyPrice) * 1e18; // keeping 18 decimals, like in Solidity
      setBookPriceInEth(BigInt(Math.round(tempBookPriceInEth)));
    }
  }, [bookPrice, nativeCurrencyPrice]);

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
                    <div className="text-black">In this page you can mint your own book.</div>
                    <div className="mt-2 text-black">
                      Publishing your book on-chain will allow you to sell it in the marketplace. You we receive 70% of
                      the revenue.
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <span className="text-4xl sm:text-6xl text-black">Publish a new book</span>
                <input
                  type="text"
                  placeholder="Book Title"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setBookName(e.target.value)}
                />
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
                  <input
                    type="text"
                    placeholder="Book Description"
                    className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                    onChange={e => setBookDescription(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Book Symbol"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setBookSymbol(e.target.value)}
                />
                <input
                  type="number"
                  min="10000000000000000"
                  max="1000000000000000000000000000"
                  placeholder="Price"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                  onChange={e => setBookPrice(Number(e.target.value))}
                />
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  placeholder="Copies"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                />
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.01"
                  placeholder="Percentage"
                  className="input font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black"
                />
                <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                  <div className="flex rounded-full border-2 border-primary p-1">
                    <button
                      className="btn btn-primary uppercase"
                      onClick={async () => {
                        try {
                          {
                            await writeContractAsync({
                              functionName: "createBook",
                              args: [bookName, bookSymbol, bookPriceInEth, bookURI],
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
          <div className="flex flex-col mt-6 px-7 py-8 bg-white opacity-100 rounded-2xl shadow-lg border-2 border-primary">
            <span className="text-2xl sm:text-2xl text-black">Upload your book file</span>
            <input
              type="file"
              placeholder="Choose File"
              className="block font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black uppercase"
              onChange={e => handleBookFileChange(e)}
            />
          </div>
          <div className="flex flex-col mt-6 px-7 py-8 bg-white opacity-100 rounded-2xl shadow-lg border-2 border-primary">
            <span className="text-2xl sm:text-2xl text-black">Upload your book cover</span>
            <input
              type="file"
              placeholder="Choose File"
              className="block font-bai-jamjuree w-full px-5 bg-white bg-[length:100%_100%] border border-primary  text-black text-lg sm:text-2xl placeholder-black uppercase"
              onChange={e => handleCoverFileChange(e)}
            />
            <div className="relative aspect-w-2 aspect-h-3 w-64 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              {coverURL ? (
                <Image src={coverURL} width={1600} height={2400} alt="Uploaded Cover" />
              ) : (
                "Drag & Drop File Here"
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
