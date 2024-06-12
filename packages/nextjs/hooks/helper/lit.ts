import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" }); // serrano , jalapeno
const chain = "polygonAmoy";

const accessControlConditions = [
  {
    contractAddress: "", // bookNFT contract address
    standardContractType: "ERC721", // ERC721
    chain: "polygonAmoy",
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">=",
      value: "1", // at least 1 NFT of the book
    },
  },
];

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient = new LitNodeClient();
  // TODO: add SIWE verification in order to get the LitNodeClient instance resigned with the Metamask
  async connect() {
    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    try {
      await client.connect();
      this.litNodeClient = client;
      console.log("LitNodeClient is: ", this.litNodeClient instanceof LitJsSdk.LitNodeClient);
      console.log("LitNodeClient connected");
    } catch (e) {
      console.log("LitNodeClient connection failed: ", e);
    }
  }

  // File encryption
  async encryptBook(bookFile: File, bookAddress: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    if (!bookAddress) {
      console.log("Book address is required");
      throw new Error("Book address is required");
    }
    console.log("bookAddress is: ", bookAddress);
    console.log("bookAddress type is : ", typeof bookAddress);

    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0], // Spread the existing properties
        contractAddress: bookAddress, // Override the contractAddress property
      },
    ];

    console.log("updatedAccessControlConditions are: ", updatedAccessControlConditions);

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "polygonAmoy" });
    // console.log("infuraID is: ", process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
    try {
      console.log("authSig:", authSig);
      console.log("accessControlConditions:", updatedAccessControlConditions);
      console.log("chain:", chain);
      console.log("file:", bookFile);
      console.log("litNodeClient:", this.litNodeClient);
      console.log("infuraId:", process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
      console.log("infuraSecretKey:", process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY);
      const ipfsCid = await LitJsSdk.encryptToIpfs({
        authSig: authSig,
        accessControlConditions: updatedAccessControlConditions,
        chain: "polygonAmoy",
        // string: "test this string",
        file: bookFile,
        litNodeClient: this.litNodeClient,
        infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "",
        infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY || "",
      });

      return ipfsCid;
    } catch (error) {
      if (error instanceof Error) {
        // console.error("Error encrypting book:", error.message);
        console.error("Error details:", error); // This will log the entire error object
      } else {
        console.error("An unknown error occurred:", error);
      }
      throw error; // This will re-throw the error, whether it's an instance of Error or not
    }
  }

  async decryptBook(ipfsCid: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    try {
      const decryptedFile = await LitJsSdk.decryptFromIpfs({
        authSig,
        ipfsCid,
        litNodeClient: this.litNodeClient,
      });
      return decryptedFile;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error decrypting book:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      throw error; // This will re-throw the error, whether it's an instance of Error or not
    }
  }
}

export default new Lit();
