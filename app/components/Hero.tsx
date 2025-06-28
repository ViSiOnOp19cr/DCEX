"use client";

import { signIn, useSession } from "next-auth/react"
import { SecondaryButton } from "./Button"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Hero = () => {
    const session = useSession();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className={`text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    The Indian Cryptocurrency
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ml-4"> 
                    Revolution
                </span>
            </div>
            
            <div className="text-xl md:text-2xl text-gray-600 mb-2 max-w-3xl mx-auto">
                Create a frictionless wallet from India with just a Google Account.
            </div>
            <div className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Convert your INR into Cryptocurrency
            </div>
            
            <div className="mb-12">
                {session.data?.user ? (
                    <SecondaryButton onClick={() => {
                        router.push("/dashboard");
                    }}>Go to Dashboard</SecondaryButton>
                ) : (
                    <SecondaryButton onClick={() => {
                        signIn("google");
                    }}>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Login with Google
                    </SecondaryButton>
                )}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                <FeatureCard 
                    icon="🚀"
                    title="Instant Setup"
                    description="Create your wallet in seconds with Google Sign-In"
                />
                <FeatureCard 
                    icon="💱"
                    title="Easy Swaps"
                    description="Swap between SOL, USDC, and USDT instantly"
                />
                <FeatureCard 
                    icon="🔒"
                    title="Secure & Safe"
                    description="Your private keys are encrypted and secure"
                />
            </div>
        </div>
    </div>
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}