# FTN Token Smart Contract Documentation

Smart contract ini digunakan untuk mengelola penjualan token **FTN** menggunakan token **USDT** sebagai metode pembayaran.  
Didesain agar dapat diintegrasikan dengan frontend menggunakan library seperti **viem**, **ethers.js**, atau **wagmi**.

---

## .env
```bash
AMOY_RPC_URL=
CONTRACT_ADDRESS=
USDT_CONTRACT_ADDRESS=
```

---

## 1. `Approve(address spender, uint256 amount)`

### Deskripsi
memberikan izin kepada **FTN Contract** agar dapat menarik token **USDT** dari wallet pengguna/buyer.

fungsi ini **harus di panggil duluan sebelum melakukan pembelian token atau menjalankan fungsi buy()**

---

### Parameter
| Nama | Tipe | Deskripsi |
|------|------|------------|
| `spender` | `address` | Alamat contract FTN (yang akan menerima token USDT) |
| `amount` | `uint256` | Jumlah maksimum USDT yang diizinkan untuk ditarik oleh FTN contract |

---

### Catatan
- nilai `amount` menggunakan satuan **wei**, gunakan `parseEther('10000000')`
- jika user belum melakukan approve, maka transaksi `buy` akan gagal.

---

### Contoh Penggunaan (viem)
```ts
import { parseEther, createWalletClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import usdtAbi from '../abi/usdt.json'
dotenv.config()

const buyer = privateKeyToAccount(`0x${process.env.PRIVATE_KEY_BUYER}`)

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
const usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS as `0x${string}`

const client = createWalletClient({
    account: buyer,
    chain: polygonAmoy,
    transport: http(process.env.AMOY_RPC_URL),
})

const amount = parseEther('10000000')

async function main() {
    try {
        console.log('start running script')

        const txHash = await client.writeContract({
            address: usdtContractAddress,
            abi: usdtAbi,
            functionName: 'approve',
            args: [contractAddress, amount]
        })

        console.log('tx hash: ', txHash)
    } catch (err) {
        console.error('error: ', err)
    }
}

main()
```

---

## 2. join()

### Deskripsi
fungsi join digunakan untuk **mendaftarkan wallet** agar ikut berpartisipasi dalam program token sale FTN.

---

### Parameter
 - 

---

### Catatan
- hanya wallet yang sudah join yang bisa melakukan pembelian / buy()
- minimal pembelian adalah `10_000_000`

---

### Contoh Penggunaan(viem)
```ts
import { createWalletClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
import abi from '../abi/launchpad.json'

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

        const txHash = await client.writeContract({
            address: contractAddress,
            abi,
            functionName: 'join'
        })

        console.log('tx hash: ', txHash)
    } catch (err) {
        console.error('error: ', err)
    }
}

main()
```

---

## 3. buy(uint256 amount_)

### Deskripsi
fungsi utama untuk membeli token **FTN** menggunakan **USDT**.
sebelum menjalankan fungsi `buy()`, user **harus melakukan `approve()` dan `join()`** pada contract USDT.

### Parameter
| Nama | Tipe | Deskripsi |
|------|------|------------|
| `amount_` | `uint256` | jumlah token FTN yang ingin dibeli dalam satuan `wei` |

---

### Persyaratan
1. sale periode aktif (`_saleStart <= now <= _saleEnd`)
2. user sudah melakukan `approve USDT` untuk jumlah yang mencukupi
3. user sudah `join()` dan `approve()`
4. jumlah pembelian sesuai dengan batas `minimum`

---

### Contoh Penggunaan
```ts
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
```