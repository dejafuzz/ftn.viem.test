// import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
// import { polygonAmoy } from 'viem/chains'
// import { privateKeyToAccount } from 'viem/accounts'
// import dotenv from 'dotenv'
// import { abi } from './abi.json' assert {type: 'json'}

// dotenv.config()

// const account = privateKeyToAccount(process.env.PRIVATE_KEY || '')
// const publicClient = createPublicClient({
//     chain: polygonAmoy,
//     transport: http(process.env.RPC_URL),
// })
// const walletClient = createWalletClient({
//     account,
//     chain: polygonAmoy,
//     transport: http(process.env.RPC_URL),
// })

// const contractAddress = process.env.CONTRACT_ADDRESS

// const readSaleStart = async () => {
//     const result = await publicClient.readContract({
//         address: contractAddress || '',
//         abi,
//         functionName: 'saleStartTime',
//     })
//     console.log('Sale Start Time: ', result.toString())
// }


// const setSaleTime = async