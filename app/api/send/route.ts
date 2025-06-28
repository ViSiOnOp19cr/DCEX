import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "../../lib/auth";
import { db } from "../../lib/prisma";
import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { 
    getAssociatedTokenAddress, 
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    getAccount
} from "@solana/spl-token";
import { connection } from "../../lib/constants";

export async function POST(req: NextRequest) {
    try {

        const session = await getServerSession(authConfig);
        if (!session?.user?.uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { toAddress, amount, tokenMint, tokenDecimals } = body;

        if (!toAddress || !amount || !tokenMint) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        let recipientPubkey: PublicKey;
        try {
            recipientPubkey = new PublicKey(toAddress);
        } catch {
            return NextResponse.json({ error: "Invalid recipient address" }, { status: 400 });
        }

        const solWallet = await db.solWallet.findFirst({
            where: {
                userId: session.user.uid
            }
        });

        if (!solWallet) {
            return NextResponse.json({ error: "No wallet found" }, { status: 404 });
        }

        const privateKeyArray = solWallet.privateKey.split(',').map(Number);
        const keypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        const senderPubkey = new PublicKey(solWallet.publicKey);

        const isNativeSol = tokenMint === "So11111111111111111111111111111111111111112";

        let txid: string;

        if (isNativeSol) {
            const lamports = Number(amount) * LAMPORTS_PER_SOL;
            
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: senderPubkey,
                    toPubkey: recipientPubkey,
                    lamports: lamports
                })
            );

            txid = await sendAndConfirmTransaction(
                connection,
                transaction,
                [keypair],
                {
                    commitment: 'confirmed'
                }
            );
        } else {
            const mintPubkey = new PublicKey(tokenMint);
            const amount_raw = Number(amount) * Math.pow(10, tokenDecimals);

            const senderTokenAccount = await getAssociatedTokenAddress(
                mintPubkey,
                senderPubkey
            );

            const recipientTokenAccount = await getAssociatedTokenAddress(
                mintPubkey,
                recipientPubkey
            );

            const transaction = new Transaction();

            try {
                await getAccount(connection, recipientTokenAccount);
            } catch {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        senderPubkey,
                        recipientTokenAccount,
                        recipientPubkey,
                        mintPubkey
                    )
                );
            }

     
            transaction.add(
                createTransferInstruction(
                    senderTokenAccount,
                    recipientTokenAccount,
                    senderPubkey,
                    amount_raw
                )
            );

            txid = await sendAndConfirmTransaction(
                connection,
                transaction,
                [keypair],
                {
                    commitment: 'confirmed'
                }
            );
        }

        return NextResponse.json({ 
            success: true,
            txnId: txid,
            explorerUrl: `https://solscan.io/tx/${txid}`
        });

    } catch (error: any) {
        console.error("Send error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send tokens" }, 
            { status: 500 }
        );
    }
} 