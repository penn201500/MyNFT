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
  let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") // Get the latest nonce

  for (let i = 0; i < tokenURIs.length; i++) {
    // Fetch and adjust the gas price
    let gasPrice = await web3.eth.getGasPrice()
    gasPrice = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(110)).div(web3.utils.toBN(100)) // Increase by 10%

    // Prepare the transaction data for gas estimation
    const txData = nftContract.methods.mintNFT(PUBLIC_KEY, tokenURIs[i]).encodeABI()

    // Estimate gas limit for the transaction dynamically
    const estimatedGas = await web3.eth.estimateGas({
      from: PUBLIC_KEY,
      to: contractAddress,
      data: txData,
      gasPrice: gasPrice.toString(),
    })

    // Increase estimated gas by a certain percentage to ensure transaction success
    const gasLimit = web3.utils.toBN(estimatedGas).mul(web3.utils.toBN(120)).div(web3.utils.toBN(100)) // Buffer of 20%

    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce++, // Increment nonce for each transaction
      gas: gasLimit.toString(), // Use dynamically estimated gas limit
      gasPrice: gasPrice.toString(), // Use the dynamically calculated gas price
      data: txData,
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
}

const tokenURIs = [
    "https://gateway.pinata.cloud/ipfs/QmNq5ryo92aqFBSYuJfnZybN9cWCR8HgSqembMz6SZpeJb", // NFT metadata URL
    "https://gateway.pinata.cloud/ipfs/QmPiVrqCa1d8sRhcEHtqsMdsoFqLkviNf8WZ8PorxyiZFV"]

mintMultipleNFTs(tokenURIs)
