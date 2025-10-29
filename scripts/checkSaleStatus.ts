import { createPublicClient, createWalletClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import abi from '../abi/launchpad.json'

dotenv.config()

const buyer = privateKeyToAccount(`0x${process.env.PRIVATE_KEY_BUYER}`)

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(process.env.AMOY_RPC_URL)
})

async function main() {
    try {
        console.log('start running script')

        const saleStart = await client.readContract({
            address: contractAddress,
            abi,
            functionName: '_saleStart'
        })

        const saleEnd = await client.readContract({
            address: contractAddress,
            abi,
            functionName: '_saleEnd'
        })

        const now = Math.floor(Date.now() / 1000)

        console.log('current time: ', new Date(now * 1000).toLocaleString())
        console.log('sale start: ', new Date(Number(saleStart) * 1000).toLocaleString())
        console.log('sale end: ', new Date(Number(saleEnd) * 1000).toLocaleString())

        if (now < Number(saleStart)) {
            console.log('sale has not started yet')
        } else if (now > Number(saleEnd)) {
            console.log('sale has ended')
        } else {
            console.log('sale is active!')
        }
    } catch (err) {
        console.error('error: ', err)
    }
}

main()