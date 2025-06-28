"use client"
import { useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { TokenWithbalance } from "../api/hooks/useToken";
import { PrimaryButton } from "../components/Button";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";

export function Send({ publicKey, tokenBalances }: {
    publicKey: string;
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithbalance[]
    } | null;
}) {
    const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [addressError, setAddressError] = useState("");

    const validateSolanaAddress = (address: string) => {
        try {
            new PublicKey(address);
            setAddressError("");
            return true;
        } catch {
            setAddressError("Invalid Solana address");
            return false;
        }
    };

    const tokenBalance = tokenBalances?.tokens.find(x => x.name === selectedToken.name)?.balance || "0";
    const hasInsufficientBalance = Number(amount) > Number(tokenBalance);
    const isValidAddress = recipientAddress && !addressError;
    const canSend = amount && Number(amount) > 0 && isValidAddress && !hasInsufficientBalance;

    const handleSend = async () => {
        if (!canSend) return;

        setSending(true);
        setSendResult(null);

        try {
            const response = await axios.post("/api/send", {
                toAddress: recipientAddress,
                amount: amount,
                tokenMint: selectedToken.mint,
                tokenDecimals: selectedToken.decimals
            });

            if (response.data.success) {
                setSendResult({
                    type: 'success',
                    message: `Successfully sent ${amount} ${selectedToken.name} to ${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`
                });
                // Reset form
                setAmount("");
                setRecipientAddress("");
                // Reload balances after 3 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error: any) {
            setSendResult({
                type: 'error',
                message: error.response?.data?.error || "Failed to send tokens. Please try again."
            });
        } finally {
            setSending(false);
        }
    };

    return <div className="p-6 md:p-12 bg-slate-50">
        <div className="text-2xl font-bold pb-4">
            Send Tokens
        </div>

        {sendResult && (
            <div className={`mb-4 p-4 rounded-lg ${sendResult.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-semibold">{sendResult.type === 'success' ? '✓ Success' : '✗ Error'}</div>
                <div className="text-sm mt-1">{sendResult.message}</div>
            </div>
        )}

        <div className="space-y-4">
            {/* Token Selection */}
            <div className="border rounded-xl p-6 bg-white">
                <div className="text-xs font-semibold mb-2">Select Token</div>
                <div className="flex justify-between items-center">
                    <select 
                        value={selectedToken.name}
                        onChange={(e) => {
                            const token = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
                            if (token) setSelectedToken(token);
                        }} 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5"
                    >
                        {SUPPORTED_TOKENS.map(token => 
                            <option key={token.name} value={token.name}>
                                {token.name}
                            </option>
                        )}
                    </select>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Available Balance</div>
                        <div className="font-semibold">{tokenBalance} {selectedToken.name}</div>
                    </div>
                </div>
            </div>

            {/* Recipient Address */}
            <div className="border rounded-xl p-6 bg-white">
                <div className="text-xs font-semibold mb-2">Recipient Address</div>
                <input 
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => {
                        setRecipientAddress(e.target.value);
                        if (e.target.value) {
                            validateSolanaAddress(e.target.value);
                        } else {
                            setAddressError("");
                        }
                    }}
                    placeholder="Enter Solana wallet address"
                    className={`w-full p-3 border rounded-lg text-sm ${addressError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {addressError && <div className="text-red-500 text-xs mt-1">{addressError}</div>}
            </div>

            {/* Amount */}
            <div className="border rounded-xl p-6 bg-white">
                <div className="text-xs font-semibold mb-2">Amount</div>
                <div className="flex items-center">
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 font-semibold">{selectedToken.name}</span>
                </div>
                {hasInsufficientBalance && amount && (
                    <div className="text-red-500 text-xs mt-1">Insufficient balance</div>
                )}
            </div>

            {/* Send Button */}
            <div className="flex justify-end pt-4">
                <PrimaryButton 
                    onClick={handleSend}
                    disabled={sending || !canSend}
                >
                    {sending ? "Sending..." : "Send"}
                </PrimaryButton>
            </div>
        </div>
    </div>
} 