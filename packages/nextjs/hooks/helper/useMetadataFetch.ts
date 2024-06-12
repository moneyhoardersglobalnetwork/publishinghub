"use client";
// hooks/useMetadataFetch.ts
import { useCallback, useEffect, useState } from "react";
// Adjust the import path accordingly
import { toGatewayURL } from "nft.storage";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { BookType } from "~~/types/types";

type UseMetadataFetchResult = {
  booksMetadata: BookType[];
};

export const useMetadataFetch = (): UseMetadataFetchResult => {
  const [booksMetadata, setBooksMetadata] = useState<BookType[]>([]);
  const [isMetadataFetched, setIsMetadataFetched] = useState<boolean>(false);

  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookCreated",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
  });

  const makeGatewayURL = useCallback((ipfsURI: string): string => {
    return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
  }, []);

  const fetchMetadata = useCallback(
    async (book: BookType): Promise<BookType> => {
      try {
        const { href } = await toGatewayURL(book.baseURI);
        const res = await fetch(href);

        if (res.ok) {
          const data: any = await res.json();
          return {
            ...book,
            priceInDollars: data.price,
            description: data.description,
            symbol: data.symbol,
            image: makeGatewayURL(data.image),
          };
        } else {
          console.error(`Failed to fetch metadata. Status: ${res.status}`);
          return book;
        }
      } catch (error: any) {
        console.error("Failed to fetch metadata:", error);
        return book;
      }
    },
    [makeGatewayURL],
  );

  useEffect(() => {
    if (data && !isLoading && !error) {
      const newBooksMetadata = data.map(event => {
        return {
          bookName: event.args.tokenName,
          bookAddress: event.args.bookAddress,
          baseURI: event.args.baseURI,
          symbol: event.args.symbol,
          price: Number(event.args.price),
        };
      });
      setBooksMetadata(newBooksMetadata);
    }
  }, [data, isLoading, error]);

  useEffect(() => {
    const fetchAllMetadata = async () => {
      const allPromises = booksMetadata.map(book => fetchMetadata(book));
      const allResults = await Promise.all(allPromises);

      const updatedBooksMetadata = allResults;
      setBooksMetadata(updatedBooksMetadata); // Update state
      setIsMetadataFetched(true);
    };

    if (booksMetadata.length > 0 && !isMetadataFetched) {
      fetchAllMetadata();
    }
  }, [booksMetadata, isMetadataFetched, fetchMetadata]);

  return { booksMetadata };
};
