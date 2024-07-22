require("dotenv").config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
console.log(`Contract ABI: ${JSON.stringify(contract)}`)
const contractAddress = "0x600E28A6FB8afa17Cb65532501060C0c29DA5B04"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest")

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then(signedTx => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction).on("receipt", receipt => console.log("Transaction receipt: ", receipt))
    })
    .catch(err => {
      console.log("Transaction failed because of error: ", err)
    })
}

async function mintMultipleNFTs(tokenURIs) {
    for (let i = 0; i < tokenURIs.length; i++) {
      await mintNFT(tokenURIs[i]); // Wait for each transaction to be mined
    }
  }

  const tokenURIs = [
    "ipfs://QmPiVrqCa1d8sRhcEHtqsMdsoFqLkviNf8WZ8PorxyiZFV",
  ];

  mintMultipleNFTs(tokenURIs);
