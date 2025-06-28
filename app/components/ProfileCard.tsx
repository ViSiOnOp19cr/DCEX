"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { TokenWithbalance, useTokens } from "../api/hooks/useToken";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import { Send } from "./Send";
import { TransactionHistory } from "./TransactionHistory";
import { AddFunds } from "./AddFunds";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw" | "history"
const tabs: {id: Tab; name: string}[] = [
    {id: "tokens", name: "Tokens"}, 
    {id: "send", name: "Send"}, 
    {id: "swap", name: "Swap"},
    {id: "history", name: "History"},
    {id: "add_funds", name: "Add funds"},
    {id: "withdraw", name: "Withdraw"},
];

export const ProfileCard = ({publicKey}: {
    publicKey: string
}) => {
    const session = useSession();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
    const { tokenBalances, loading, error } = useTokens(publicKey);

    if (session.status === "loading") {
        return <div>
            Loading...
        </div>
    }

    if (!session.data?.user) {
        router.push("/")
        return null
    }

    return <div className="pt-8 flex justify-center px-4">
        <div className="max-w-4xl bg-white rounded shadow w-full">
            <Greeting 
                image={session.data?.user?.image ?? ""} 
                name={session.data?.user?.name ?? ""} 
            />
            <div className="w-full flex px-4 md:px-10 overflow-x-auto">
                {tabs.map(tab => <TabButton key={tab.id} active={tab.id === selectedTab} onClick={() => {
                    setSelectedTab(tab.id)
                }}>{tab.name}</TabButton>)}
            </div>
            
            <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}><Assets tokenBalances={tokenBalances} loading={loading} error={error} publicKey={publicKey} /> </div>
            <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}><Swap tokenBalances={tokenBalances} publicKey={publicKey} /> </div>
            <div className={`${selectedTab === "send" ? "visible" : "hidden"}`}><Send tokenBalances={tokenBalances} publicKey={publicKey} /> </div>
            <div className={`${selectedTab === "history" ? "visible" : "hidden"}`}><TransactionHistory publicKey={publicKey} /> </div>
            <div className={`${selectedTab === "add_funds" ? "visible" : "hidden"}`}><AddFunds publicKey={publicKey} /> </div>
            <div className={`${(selectedTab !== "swap" && selectedTab !== "tokens" && selectedTab !== "send" && selectedTab !== "history" && selectedTab !== "add_funds") ? "visible" : "hidden"}`}><Warning /> </div>
        </div>
        
    </div>
}

function Warning() {
    return <div className="bg-slate-50 py-32 px-10 flex justify-center">
        We dont yet support this feature
    </div>
}

function Assets({publicKey, tokenBalances, loading, error}: {
    publicKey: string;
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithbalance[]
    } | null;
    loading: boolean;
    error: string | null;
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied])

    if (loading) {
        return <div className="bg-slate-50 py-32 px-10 flex justify-center">
            Loading token balances...
        </div>
    }

    if (error) {
        return <div className="bg-red-50 py-32 px-10 flex justify-center text-red-600">
            <div className="text-center">
                <div className="text-lg font-semibold">Error loading token balances</div>
                <div className="text-sm mt-2">{error}</div>
                <div className="text-xs mt-2 text-gray-500">Check the console for more details</div>
            </div>
        </div>
    }

    return <div className="text-slate-500">
        <div className="mx-6 md:mx-12 py-2">
            Account assets
        </div>
        <div className="flex flex-col md:flex-row justify-between mx-6 md:mx-12 space-y-4 md:space-y-0">
            <div className="flex">
                <div className="text-3xl md:text-5xl font-bold text-black">
                    ${tokenBalances?.totalBalance}
                </div>
                <div className="font-slate-500 font-bold text-xl md:text-3xl flex flex-col justify-end pb-0 pl-2">
                    USD
                </div>
            </div>

            <div>
                <PrimaryButton onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                    setCopied(true)
                }}>{copied ? "Copied" : "Your wallet address"}</PrimaryButton>
            </div>
        </div>

        <div className="pt-4 bg-slate-50 p-6 md:p-12 mt-4">
            <TokenList tokens={tokenBalances?.tokens || []} />
        </div>
    </div>
}

function Greeting({
    image, name
}: {
    image: string, name: string
}) {
    return <div className="flex p-6 md:p-12">
        <img src={image} className="rounded-full w-12 h-12 md:w-16 md:h-16 mr-4" />
        <div className="text-lg md:text-2xl font-semibold flex flex-col justify-center">
           Welcome back, {name}
        </div>
    </div>
}