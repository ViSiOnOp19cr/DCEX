import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "../../lib/auth";
import { db } from "../../lib/prisma";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "../../lib/constants";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        // Get user session
        const session = await getServerSession(authConfig);
        if (!session?.user?.uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get request body
        const body = await req.json();
        const { quoteResponse } = body;

        if (!quoteResponse) {
            return NextResponse.json({ error: "Quote response is required" }, { status: 400 });
        }

        // Fetch user's Solana wallet
        const solWallet = await db.solWallet.findFirst({
            where: {
                userId: session.user.uid
            }
        });

        if (!solWallet) {
            return NextResponse.json({ error: "No wallet found" }, { status: 404 });
        }

        // Get swap transaction from Jupiter
        const { data } = await axios.post('https://quote-api.jup.ag/v6/swap', {
            quoteResponse,
            userPublicKey: solWallet.publicKey,
            wrapAndUnwrapSol: true,
            // Uncomment for priority fees (faster transactions)
            // prioritizationFeeLamports: 'auto'
        });

        const { swapTransaction } = data;

        // Deserialize the transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // Sign the transaction
        const privateKeyArray = solWallet.privateKey.split(',').map(Number);
        const keypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        transaction.sign([keypair]);

        // Execute the transaction
        const rawTransaction = transaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });

        // Confirm transaction
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid
        }, 'confirmed');

        return NextResponse.json({ 
            success: true,
            txnId: txid,
            explorerUrl: `https://solscan.io/tx/${txid}`
        });

    } catch (error: any) {
        console.error("Swap error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to execute swap" }, 
            { status: 500 }
        );
    }
} 