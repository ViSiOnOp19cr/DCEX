"use client"
import { useEffect, useState } from "react"
import axios from "axios"

interface Transaction {
    signature: string;
    timestamp: number;
    type: 'sent' | 'received' | 'swap' | 'unknown';
    amount: string;
    token: string;
    from?: string;
    to?: string;
    status: 'success' | 'failed';
}

export function TransactionHistory({ publicKey }: { publicKey: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`/api/transactions?address=${publicKey}`);
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch transactions");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [publicKey]);

    if (loading) {
        return (
            <div className="p-6 md:p-12 bg-slate-50">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <div className="mt-2 text-gray-600">Loading transaction history...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 md:p-12 bg-slate-50">
                <div className="text-center py-8 text-red-600">
                    <div className="text-lg font-semibold">Error loading transactions</div>
                    <div className="text-sm mt-2">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 bg-slate-50">
            <div className="text-2xl font-bold pb-4">
                Transaction History
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg">
                    <div className="text-gray-500">No transactions found</div>
                    <div className="text-sm text-gray-400 mt-2">Your transaction history will appear here</div>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <TransactionRow key={tx.signature} transaction={tx} currentAddress={publicKey} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TransactionRow({ transaction, currentAddress }: { 
    transaction: Transaction; 
    currentAddress: string 
}) {
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'sent':
                return '↑';
            case 'received':
                return '↓';
            case 'swap':
                return '⇄';
            default:
                return '•';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'sent':
                return 'text-red-600';
            case 'received':
                return 'text-green-600';
            case 'swap':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-start">
                    <div className={`text-2xl mr-3 ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                        <div className="font-semibold capitalize">{transaction.type}</div>
                        <div className="text-sm text-gray-500">
                            {transaction.type === 'sent' && transaction.to && (
                                <>To: {formatAddress(transaction.to)}</>
                            )}
                            {transaction.type === 'received' && transaction.from && (
                                <>From: {formatAddress(transaction.from)}</>
                            )}
                            {transaction.type === 'swap' && (
                                <>Token Swap</>
                            )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {formatDate(transaction.timestamp)}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'sent' ? '-' : '+'}{transaction.amount} {transaction.token}
                    </div>
                    <a 
                        href={`https://solscan.io/tx/${transaction.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                    >
                        View on explorer →
                    </a>
                </div>
            </div>
        </div>
    );
} 