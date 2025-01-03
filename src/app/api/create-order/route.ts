import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    const { productId } = await req.json();
    try {
        const product = await db.product.findUnique({
            where: { id: productId },
        });

        if (!product) throw new Error("Product not found");
        console.log("product", product);

        const order = await razorpay.orders.create({
            amount: 100 * product.price, // amount in paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return NextResponse.json(
            { orderId: order.id, amount: product.price },
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error creating the order: ${error}`);
        return NextResponse.json(
            { error: "Error creating the order" },
            { status: 500 }
        );
    }
}
