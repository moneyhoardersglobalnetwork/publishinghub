# Decentralized Digital Book Publishing and Market Place
actively in development
<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>


#  Publishing Hub and Market Place
🧪This app is a On-Chain digital Book and Comic Book Publishing service with a built in marketplace.
Users can buy and sell digital books and comic books. This brings the power of the blockchain to the masses.

Upgrades can later be made to the app to include more features. Like subcription based services, a book review system, and more. Think a user subcribing to a specific author and earn rewards for their book purchases.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with the app, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Publishing Hub

We welcome contributions to Publishing Hub!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.


## To Do List

I want add a description section to the assets
I've simplified the publishing process for nate token purchases
Must create logic for withdrawl from the Book contract to tranfers a portion back to the Publishing Factory.
We can also put the Creation Fee back in a test charging for creating books in native and USDC then MHGD.
I want to change all book references to PublishedAsset because not just books can be published.
The entire concept is empowering creators to generate income and monetize their work.

https://web3.storage/ - Web3 Storage using IPFS for Authors.
https://console.web3.storage/ - Authors can easily get the CID links for creating their assets.





//Update these with the https link to the IPFS files be sure to add file extensions to the end of the links.
//Naming of files before upload is important to ensure author doesnt have to reset CIDs
https://bafybeiahc326k4bww2dub5s3ylpbgcvzh6qrkqru4gn7lw5ebztsn4awba.ipfs.w3s.link/Hoarder%20Labs%20Manifest.pdf -IPFS Hoarder Labs Manfest PDF
https://bafybeic3uzulj7ho42dymwb2uvghpp6ivsdqffqflaotuad62tkk3xq35m.ipfs.w3s.link/MHGNMockBooks.pdf -IPFS Mock Book PDF file
https://bafybeicn3agxjjh4dac6srokrbpmehcalmdte3mhtod4gkz4zycxvlv3gu.ipfs.w3s.link/hhg_cover.jpg -IPFS The Hitchhiker's Guide
https://bafybeiahavl4cjqcqr5vm4pzadk3o3oysm7y4yxuaem5ehu45nqpanemi4.ipfs.w3s.link/download.jpeg -IPFS Mock Book Cover Image Detective Comics
