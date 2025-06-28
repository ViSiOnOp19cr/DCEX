"use client"
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { TokenWithbalance } from "../api/hooks/useToken";
import { PrimaryButton } from "../components/Button";
import axios from "axios";

export function Swap({ publicKey, tokenBalances }: {
    publicKey: string;
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithbalance[]
    } | null;
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0])
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1])
    const [baseAmount, setBaseAmount] = useState<string>("");
    const [quoteAmount, setQuoteAmount] = useState<string>("");
    const [fetchingQuote, setFetchingQuote] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState(null);
    const [swapping, setSwapping] = useState(false);
    const [swapResult, setSwapResult] = useState<{type: 'success' | 'error', message: string} | null>(null);

    useEffect(() => {
        if (!baseAmount || baseAmount === "0" || Number(baseAmount) <= 0) {
            setQuoteAmount("");
            setQuoteResponse(null);
            return;
        }
        
        setFetchingQuote(true);
        const amountInSmallestUnit = Math.floor(Number(baseAmount) * Math.pow(10, baseAsset.decimals));
        
        axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${amountInSmallestUnit}&slippageBps=50`)
            .then(res => {
                setQuoteAmount((Number(res.data.outAmount) / Math.pow(10, quoteAsset.decimals)).toString())
                setFetchingQuote(false);
                setQuoteResponse(res.data);
            })
            .catch(err => {
                console.error("Quote fetch error:", err);
                setFetchingQuote(false);
                setQuoteAmount("");
                setQuoteResponse(null);
            })

    }, [baseAsset, quoteAsset, baseAmount])

    const handleSwap = async () => {
        if (!quoteResponse || !baseAmount) return;
        
        setSwapping(true);
        setSwapResult(null);
        
        try {
            const res = await axios.post("/api/swap", { 
                quoteResponse
            });
            
            if (res.data.success && res.data.txnId) {
                setSwapResult({
                    type: 'success',
                    message: `Swap successful! View on explorer: ${res.data.explorerUrl}`
                });
                setBaseAmount("");
                setQuoteAmount("");
                setQuoteResponse(null);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch(e: any) {
            console.error("Swap error:", e);
            setSwapResult({
                type: 'error',
                message: e.response?.data?.error || "Failed to execute swap. Please try again."
            });
        } finally {
            setSwapping(false);
        }
    };

    const baseBalance = tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance || "0";
    const hasInsufficientBalance = Number(baseAmount) > Number(baseBalance);

    return <div className="p-6 md:p-12 bg-slate-50">
        <div className="text-2xl font-bold pb-4">
            Swap Tokens
        </div>
        
        {swapResult && (
            <div className={`mb-4 p-4 rounded-lg ${swapResult.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-semibold">{swapResult.type === 'success' ? '✓ Success' : '✗ Error'}</div>
                <div className="text-sm mt-1">{swapResult.message}</div>
                {swapResult.type === 'success' && swapResult.message.includes('explorer') && (
                    <a href={swapResult.message.split(': ')[1]} target="_blank" rel="noopener noreferrer" className="text-sm underline mt-2 inline-block">
                        View transaction →
                    </a>
                )}
            </div>
        )}
        
         <SwapInputRow 
            amount={baseAmount} 
            onAmountChange={(value: string) => {
                setBaseAmount(value);
            }}
            onSelect={(asset) => {
                setBaseAsset(asset)
            }} 
            selectedToken={baseAsset} 
            title={"You pay:"} 
            topBorderEnabled={true} 
            bottomBorderEnabled={false} 
            subtitle={<div className="text-slate-500 pt-1 text-sm pl-1 flex">
                <div className="font-normal pr-1">
                    Current Balance:
                </div>
                <div className={`font-semibold ${hasInsufficientBalance ? 'text-red-600' : ''}`}>
                    {baseBalance} {baseAsset.name}
                </div>
            </div>}
        />
        
         <div className="flex justify-center">
            <div onClick={() => {
                let baseAssetTemp = baseAsset;
                setBaseAsset(quoteAsset);
                setQuoteAsset(baseAssetTemp);
            }} className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2 hover:shadow-lg transition-shadow">
                <SwapIcon />
            </div>
        </div>
 
        <SwapInputRow inputLoading={fetchingQuote} inputDisabled={true} amount={quoteAmount} onSelect={(asset) => {
            setQuoteAsset(asset)
         }} selectedToken={quoteAsset} title={"You receive"}  topBorderEnabled={false} bottomBorderEnabled={true} />

         <div className="flex justify-end pt-4">
            <PrimaryButton 
                onClick={handleSwap}
                disabled={swapping || !baseAmount || !quoteAmount || fetchingQuote || hasInsufficientBalance || !quoteResponse}
            >
                {swapping ? "Swapping..." : hasInsufficientBalance ? "Insufficient Balance" : "Swap"}
            </PrimaryButton>
        </div>
    </div>
}

function SwapInputRow({onSelect, amount, onAmountChange, selectedToken, title, subtitle, topBorderEnabled, bottomBorderEnabled, inputDisabled, inputLoading}: {
    onSelect: (asset: TokenDetails) => void;
    selectedToken: TokenDetails;
    title: string;
    subtitle?: ReactNode;
    topBorderEnabled: boolean;
    bottomBorderEnabled: boolean;
    amount?: string;
    onAmountChange?: (value: string) => void;
    inputDisabled?: boolean;
    inputLoading?: boolean;
}) {
    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
            <div className="text-xs font-semibold mb-1">
                {title}
            </div>
            <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
            {subtitle}
        </div>
        <div>
            <input 
                disabled={inputDisabled} 
                onChange={(e) => {
                    onAmountChange?.(e.target.value);
                }} 
                placeholder="0" 
                type="text" 
                className="bg-slate-50 p-6 outline-none text-4xl" 
                dir="rtl" 
                value={inputLoading ? "Loading..." : (amount || "")}
            />
        </div>
    </div>
}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails;
    onSelect: (asset: TokenDetails) => void;
}) {
    return <div className="w-24">
        <select 
            value={selectedToken.name}
            onChange={(e) => {
                const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
                if (selectedToken) {
                    onSelect(selectedToken);
                }
            }} 
            id="countries" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            {SUPPORTED_TOKENS.map(token => 
                <option key={token.name} value={token.name}>
                    {token.name}
                </option>
            )}
        </select>
    </div>
}

function SwapIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
}