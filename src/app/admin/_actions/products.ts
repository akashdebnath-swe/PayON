"use server";

import { z } from "zod";
import fs from "fs/promises";
import { db } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
    (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine((file) => file.size > 0, "Required"),
    image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export const addProduct = async (prevState: unknown, formData: FormData) => {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

    if (result.success === false) {
        return result.error.formErrors.fieldErrors;
    }

    const data = result.data;

    // Saving the file
    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    // Saving the image
    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
    );

    // Saving the data to database
    await db.product.create({
        data: {
            name: data.name,
            description: data.description,
            priceInCents: data.priceInCents,
            filePath,
            imagePath,
            isAvailableForPurchase: false,
        },
    });

    redirect("/admin/products");
};

export async function toggleProductAvailability(
    id: string,
    isAvailableForPurchase: boolean
) {
    await db.product.update({
        where: { id },
        data: { isAvailableForPurchase },
    });
}

export async function deleteProduct(id: string) {
    const product = await db.product.delete({
        where: { id },
    });

    if (product == null) return notFound();

    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);
}