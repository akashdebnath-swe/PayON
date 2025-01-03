/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: any;
    }
}

type OPTIONS = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefile: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
};

const PurchasePage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { id } = useParams();
    if (!id) return notFound();

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // create order
            const { data } = await axios.post("/api/create-order", {
                productId: id,
            });
            console.log("axios res:", data);

            // Initialize Razorpay
            const options: OPTIONS = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
                amount: data.amount,
                currency: "INR",
                name: "Hikari-ORG",
                description: "Test Transaction",
                order_id: data.orderId,
                handler: function (response: any) {
                    console.log("Payment successful: ", response);
                    router.push("/razorpay/purchase-success");
                },
                prefile: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "1234567890",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed: ", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <h1>PurchasePage</h1>
            <h1>product id: {id}</h1>
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default PurchasePage;
