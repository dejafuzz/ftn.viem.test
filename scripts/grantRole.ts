import { createWalletClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import { keccak256, toBytes } from 'viem'
import abi from '../abi/launchpad.json'

dotenv.config()

const deployer = privateKeyToAccount(`0x${process.env.PRIVATE_KEY_DEPLOYER}`)

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const client = createWalletClient({
    account: deployer,
    chain: polygonAmoy,
    transport: http(process.env.AMOY_RPC_URL),
})

const BUYER_ROLE = keccak256(toBytes('BUYER_ROLE'))

const targetAddress = process.env.TARGET_ADDRESS as `0x${string}`

async function main() {
    try {
        console.log('start running script')

        const txHash = await client.writeContract({
            address: contractAddress,
            abi,
            functionName: 'grantRole',
            args: [BUYER_ROLE, targetAddress]
        })

        console.log('tx hash: ', txHash)

    } catch (err) {
        console.error('error: ', err)
    }
}

main()