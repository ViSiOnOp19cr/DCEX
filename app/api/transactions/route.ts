import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { connection } from "../../lib/constants";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');
        
        if (!address) {
            return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
        }

        const pubkey = new PublicKey(address);
        
        const signatures = await connection.getSignaturesForAddress(pubkey, {
            limit: 20
        });

        const transactions = await Promise.all(
            signatures.map(async (sig) => {
                try {
                    const tx = await connection.getParsedTransaction(sig.signature, {
                        maxSupportedTransactionVersion: 0
                    });
                    
                    if (!tx || !tx.meta) return null;

                    let type: 'sent' | 'received' | 'swap' | 'unknown' = 'unknown';
                    let amount = '0';
                    let token = 'SOL';
                    let from = '';
                    let to = '';

                    const instructions = tx.transaction.message.instructions;
                    
                    for (const instruction of instructions) {
                        if ('parsed' in instruction && instruction.parsed) {
                            const parsedInfo = instruction.parsed;
                            
                            if (parsedInfo.type === 'transfer' || parsedInfo.type === 'transferChecked') {
                                const info = parsedInfo.info;
                                from = info.source || info.sender || '';
                                to = info.destination || info.recipient || '';
                                
                                if (from === address) {
                                    type = 'sent';
                                } else if (to === address) {
                                    type = 'received';
                                }
                                
                                if (info.tokenAmount) {
                                    amount = info.tokenAmount.uiAmountString || info.tokenAmount.amount;
                                    token = 'Token';
                                } else if (info.lamports) {
                                    amount = (info.lamports / 1e9).toString();
                                    token = 'SOL';
                                } else if (info.amount) {
                                    amount = info.amount;
                                }
                            }
                            
                            if (parsedInfo.program === 'jupiter' || 
                                (instruction.programId && instruction.programId.toString().includes('JUP'))) {
                                type = 'swap';
                            }
                        }
                    }

                    if (type === 'unknown' && tx.meta.preBalances && tx.meta.postBalances) {
                        const accountIndex = tx.transaction.message.accountKeys.findIndex(
                            key => key.pubkey.toString() === address
                        );
                        
                        if (accountIndex !== -1) {
                            const balanceChange = tx.meta.postBalances[accountIndex] - tx.meta.preBalances[accountIndex];
                            if (balanceChange > 0) {
                                type = 'received';
                                amount = (balanceChange / 1e9).toString();
                            } else if (balanceChange < 0) {
                                type = 'sent';
                                amount = (Math.abs(balanceChange) / 1e9).toString();
                            }
                        }
                    }

                    return {
                        signature: sig.signature,
                        timestamp: sig.blockTime || Date.now() / 1000,
                        type,
                        amount,
                        token,
                        from,
                        to,
                        status: tx.meta.err ? 'failed' : 'success'
                    };
                } catch (err) {
                    console.error("Error parsing transaction:", err);
                    return null;
                }
            })
        );

        const validTransactions = transactions
            .filter(tx => tx !== null)
            .sort((a, b) => b!.timestamp - a!.timestamp);

        return NextResponse.json({ transactions: validTransactions });
        
    } catch (error: any) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transaction history" }, 
            { status: 500 }
        );
    }
} 