import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint} from "@solana/spl-token";
import { getSupportedTokens, connection } from "../../lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Helper function - NOT exported
async function getAccountBalance(token: {
    name: string;
    mint: string;
    native: boolean;
    decimals: number
}, address: string) {
    try {
        if (token.native) {
            let balance = await connection.getBalance(new PublicKey(address));
            console.log(`${token.name} balance: ${balance} lamports`);
            return balance / LAMPORTS_PER_SOL;
        }
        
        const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
        console.log(`Getting balance for ${token.name} at ATA: ${ata.toString()}`);

        try {
            const account = await getAccount(connection, ata);   
            const balance = Number(account.amount) / (10 ** token.decimals);
            console.log(`${token.name} balance: ${balance}`);
            return balance;
        } catch(e) {
            console.log(`No account found for ${token.name}, balance: 0`);
            return 0;
        }
    } catch (error) {
        console.error(`Error getting balance for ${token.name}:`, error);
        return 0;
    }
}

// Only export the HTTP method handler
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address') as unknown as string;
        
        if (!address) {
            return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
        }

        console.log("Fetching tokens for address:", address);
        const supportedTokens = await getSupportedTokens();
        console.log("Supported tokens:", supportedTokens);
        
        const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address)));
        console.log("Balances:", balances);

        const tokens = supportedTokens.map((token, index) => ({
            ...token,
            balance: balances[index].toFixed(2),
            usdBalance: (balances[index] * Number(token.price)).toFixed(2)
        }));

        return NextResponse.json({
            tokens,
            totalBalance: tokens.reduce((acc, val) => acc + Number(val.usdBalance), 0).toFixed(2)
        });
    } catch (error) {
        console.error("Error in tokens API:", error);
        return NextResponse.json(
            { error: "Failed to fetch token balances" }, 
            { status: 500 }
        );
    }
}