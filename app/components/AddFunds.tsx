"use client"
import { useState } from "react"
import { PrimaryButton } from "./Button"

export function AddFunds({ publicKey }: { publicKey: string }) {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [showQR, setShowQR] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleAddFunds = async () => {
        if (!amount || Number(amount) <= 0) return;
        
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setShowQR(true);
            setProcessing(false);
        }, 1000);
    };

    const paymentMethods = [
        { id: "upi", name: "UPI", icon: "📱" },
        { id: "netbanking", name: "Net Banking", icon: "🏦" },
        { id: "card", name: "Credit/Debit Card", icon: "💳" },
    ];

    return (
        <div className="p-6 md:p-12 bg-slate-50">
            <div className="text-2xl font-bold pb-4">
                Add Funds to Your Wallet
            </div>

            {!showQR ? (
                <div className="space-y-4">
                    {/* Amount Input */}
                    <div className="border rounded-xl p-6 bg-white">
                        <div className="text-xs font-semibold mb-2">Enter Amount (INR)</div>
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">₹</span>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="flex-1 p-3 text-2xl border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            Minimum: ₹100 | Maximum: ₹1,00,000
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="border rounded-xl p-6 bg-white">
                        <div className="text-xs font-semibold mb-4">Select Payment Method</div>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <label 
                                    key={method.id}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                        paymentMethod === method.id 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="text-2xl mr-3">{method.icon}</span>
                                    <span className="font-medium">{method.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Exchange Rate Info */}
                    <div className="border rounded-xl p-6 bg-blue-50">
                        <div className="text-sm">
                            <div className="font-semibold text-blue-900">Exchange Rate</div>
                            <div className="mt-1 text-blue-700">
                                ₹{amount || '0'} = ~{((Number(amount) || 0) / 83).toFixed(2)} USDC
                            </div>
                            <div className="text-xs mt-2 text-blue-600">
                                *Rate includes a 2% conversion fee
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <PrimaryButton 
                            onClick={handleAddFunds}
                            disabled={processing || !amount || Number(amount) < 100 || Number(amount) > 100000}
                        >
                            {processing ? "Processing..." : "Proceed to Payment"}
                        </PrimaryButton>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="inline-block p-8 bg-white rounded-xl shadow-lg">
                        <div className="text-lg font-semibold mb-4">Complete Payment</div>
                        
                        {/* Mock QR Code */}
                        <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center rounded-lg">
                            <div className="text-gray-500 text-center">
                                <div className="text-6xl mb-2">📱</div>
                                <div className="text-sm">Scan QR Code</div>
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-4">
                            Scan with any UPI app to pay ₹{amount}
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-4">
                            UPI ID: dcex@paytm
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                            ⚠️ Demo Mode: This is a simulated payment flow
                        </div>
                        
                        <button
                            onClick={() => {
                                setShowQR(false);
                                setAmount("");
                                alert("Demo: Payment would be processed here!");
                            }}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 