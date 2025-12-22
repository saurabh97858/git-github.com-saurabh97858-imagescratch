import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { plans, assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { FiShield, FiCheck, FiArrowLeft, FiCreditCard, FiLock, FiGift } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const Purchase = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, loadCreditsData } = useContext(AppContext);
    const { isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('upi');

    const plan = plans.find((p) => p.id === planId);

    useEffect(() => {
        if (!plan) {
            // toast.error("Invalid Plan Selected");
            // navigate("/buy");
        }
    }, [plan, navigate]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            if (!isSignedIn) {
                toast.error("Please Login First!");
                return navigate("/sign-in");
            }

            const { data } = await axios.post(
                backendUrl + "/api/user/pay-razor",
                { planId: plan.id },
                { withCredentials: true }
            );

            if (data.success) {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.order.amount,
                    currency: data.order.currency,
                    name: "Imagify Credits",
                    description: `Purchase ${plan.credits} Credits`,
                    order_id: data.order.id,
                    receipt: data.order.receipt,
                    handler: async function (response) {
                        try {
                            const verifyData = await axios.post(
                                backendUrl + "/api/user/verify-razor",
                                response,
                                { withCredentials: true }
                            );
                            if (verifyData.data.success) {
                                loadCreditsData();
                                toast.success("Payment Successful! Credits Added. 🚀");
                                navigate("/");
                            } else {
                                toast.error("Payment Verification Failed");
                            }
                        } catch (error) {
                            toast.error("Payment Verification Failed");
                        }
                    },
                    prefill: {
                        name: user?.fullName,
                        email: user?.primaryEmailAddress?.emailAddress,
                        method: selectedMethod // Hint to Razorpay (optional)
                    },
                    theme: {
                        color: "#F97316",
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error("Payment Initialization Failed!");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!plan) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Plan Not Found</h2>
                    <p className="text-gray-400 mb-6">The plan you are looking for does not exist.</p>
                    <button
                        onClick={() => navigate("/buy")}
                        className="bg-orange-500 text-white px-6 py-2 rounded-full"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-[95%] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
            >
                {/* Left Side: Order Summary */}
                <div className="p-8 md:p-12 flex flex-col justify-between relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
                    >
                        <FiArrowLeft /> Back
                    </button>

                    <div className="mt-10">
                        <h2 className="text-3xl font-bold mb-2">Order Summary</h2>
                        <p className="text-gray-400 text-sm">Review your selected plan before proceeding.</p>

                        <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <img src={assets.logo_icon} className="w-8 opacity-90" alt="" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{plan.id} Plan</h3>
                                    <p className="text-gray-400 text-sm">{plan.credits} Credits Pack</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Subtotal</span>
                                    <span>${plan.price}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-lg font-bold text-white">
                                    <span>Total</span>
                                    <span className="text-orange-400">${plan.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3 text-xs text-gray-500">
                        <FiShield className="text-green-500 text-lg" />
                        <span>256-bit SSL Secure Payment</span>
                    </div>
                </div>

                {/* Right Side: Checkout Actions */}
                <div className="bg-white/5 p-8 md:p-12 flex flex-col justify-center border-l border-white/5">
                    <h3 className="text-2xl font-bold mb-6">Complete Payment</h3>

                    {/* Personal Details */}
                    <div className="mb-8 space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Billed To</label>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                <img src={user?.imageUrl} alt="User" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                                    <p className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {/* UPI Option */}
                        <div
                            onClick={() => setSelectedMethod('upi')}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedMethod === 'upi'
                                ? 'border-orange-500/50 bg-orange-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="p-2 bg-white rounded-lg">
                                <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-2085056-1747946.png" className="w-6 h-6 object-contain" alt="UPI" />
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${selectedMethod === 'upi' ? 'text-white' : 'text-gray-300'}`}>UPI / QR Code</p>
                                <p className="text-xs text-gray-400">Google Pay, PhonePe, Paytm</p>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-orange-500' : 'border-gray-600'}`}>
                                {selectedMethod === 'upi' && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                            </div>
                        </div>

                        {/* Card Option */}
                        <div
                            onClick={() => setSelectedMethod('card')}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedMethod === 'card'
                                ? 'border-orange-500/50 bg-orange-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <FiCreditCard className={`text-xl ${selectedMethod === 'card' ? 'text-orange-500' : 'text-gray-400'}`} />
                            <div>
                                <p className={`font-semibold text-sm ${selectedMethod === 'card' ? 'text-white' : 'text-gray-300'}`}>Credit / Debit Card</p>
                                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-orange-500' : 'border-gray-600'}`}>
                                {selectedMethod === 'card' && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                            </div>
                        </div>

                        {/* Net Banking Option */}
                        <div
                            onClick={() => setSelectedMethod('netbanking')}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedMethod === 'netbanking'
                                ? 'border-orange-500/50 bg-orange-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <FiLock className={`text-xl ${selectedMethod === 'netbanking' ? 'text-orange-500' : 'text-gray-400'}`} />
                            <div>
                                <p className={`font-semibold text-sm ${selectedMethod === 'netbanking' ? 'text-white' : 'text-gray-300'}`}>Net Banking</p>
                                <p className="text-xs text-gray-500">All Indian Banks Supported</p>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'netbanking' ? 'border-orange-500' : 'border-gray-600'}`}>
                                {selectedMethod === 'netbanking' && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            "Processing..."
                        ) : (
                            <>
                                <FiLock /> Pay ${plan.price} Securely
                            </>
                        )}
                    </motion.button>

                    <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/5 rounded-lg p-2">
                            <FiCheck className="mx-auto text-green-500 mb-1" />
                            <p className="text-[10px] text-gray-400">Instant Activation</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                            <FiShield className="mx-auto text-blue-500 mb-1" />
                            <p className="text-[10px] text-gray-400">100% Secure</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                            <FiGift className="mx-auto text-pink-500 mb-1" />
                            <p className="text-[10px] text-gray-400">No Hidden Fees</p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        By clicking "Pay", you agree to our Terms of Service.
                        <br /> 30-Day Money Back Guarantee.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Purchase;
