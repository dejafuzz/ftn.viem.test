import { createWalletClient, http, parseEther } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import abi from '../abi/launchpad.json'
import usdtAbi from "../abi/usdt.json"

dotenv.config()

const buyer = privateKeyToAccount(`0x${process.env.PRIVATE_KEY_BUYER}`)

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const client = createWalletClient({
    account: buyer,
    chain: polygonAmoy,
    transport: http(process.env.AMOY_RPC_URL),
})

async function main() {
    try {
        console.log('start running script')

        const amount = parseEther('10000000')

        const txHash = await client.writeContract({
            address: contractAddress,
            abi: [...abi, ...usdtAbi],
            functionName: 'buy',
            args: [amount]
        })

        console.log('tx hash: ', txHash)
    } catch (err) {
        console.error('error: ', err)
    }
}

main()