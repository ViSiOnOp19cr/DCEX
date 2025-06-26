import { TokenDetails } from "../../lib/tokens";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TokenWithbalance extends TokenDetails {
    balance: string;
    usdBalance: string;
}

export function useTokens(address: string) {
    const [tokenBalances, setTokenBalances] = useState<{
        totalBalance: number,
        tokens: TokenWithbalance[]
    } | null >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address) {
            setLoading(false);
            setError("No address provided");
            return;
        }

        console.log("Fetching tokens for address:", address);
        axios.get(`/api/tokens?address=${address}`)
            .then(res => {
                console.log("Token data received:", res.data);
                setTokenBalances(res.data);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error("Error fetching tokens:", err);
                setError(err.response?.data?.error || "Failed to fetch token balances");
                setLoading(false);
            });
    }, [address])

    return {
        loading, tokenBalances, error
    }
}