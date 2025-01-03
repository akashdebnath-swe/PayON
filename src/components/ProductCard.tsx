"use client";

import { formatCurrency } from "@/lib/formatters";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

type ProductCardProps = {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    imagePath: string;
};

const stripePromise = loadStripe(process.env.stripe_public_key as string);

export function ProductCard({
    id,
    name,
    priceInCents,
    description,
    imagePath,
}: ProductCardProps) {
    const createCheckOutSession = async () => {
        const product = await db.product.findUnique({ where: { id } });
        const stripe = await stripePromise;

        // Call the backend to create a checkout session...
        const checkoutSession = await axios.post(
            "/api/create-checkout-session",
            {
                items: product,
                email: "test@gmail.com",
            }
        );

        console.log(checkoutSession.data.id);

        if (stripe == null) return notFound();

        // Redirect user/customer to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });

        if (result.error) alert(result.error.message);
    };

    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} fill alt={name} />
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatCurrency(priceInCents / 100)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button
                    size="lg"
                    className="w-full"
                    onClick={createCheckOutSession}
                >
                    Purchase
                </Button>
            </CardFooter>
        </Card>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col animate-pulse">
            <div className="w-full aspect-video bg-gray-300" />
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-full bg-gray-300" />
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-full bg-gray-300" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-3/4 h-4 rounded-full bg-gray-300" />
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled size="lg"></Button>
            </CardFooter>
        </Card>
    );
}
