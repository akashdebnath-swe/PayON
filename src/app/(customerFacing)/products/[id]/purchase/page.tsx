import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PurchasePage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const product = await db.product.findUnique({
        where: { id },
    });

    if (product == null) return notFound();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "USD",
        metadata: { productId: product.id },
    });

    if (paymentIntent.client_secret == null) {
        throw Error("Stripe failed to create payment intent");
    }

    return <div>PurchasePage</div>;
};

export default PurchasePage;
