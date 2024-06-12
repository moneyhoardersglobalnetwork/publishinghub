// ipfsHelper.ts
import { File, NFTStorage } from "nft.storage";

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "" });
// console.log(process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY);

export async function storeOnIPFS(file: File, name: string, description: string, symbol: string, price: string) {
  const formattedPrice = `$${price}`;
  const metadata = await client.store({
    name,
    description,
    image: file,
    symbol,
    price: formattedPrice,
  });
  return metadata.url;
}
