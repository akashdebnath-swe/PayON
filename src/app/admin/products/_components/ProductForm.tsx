"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useActionState, useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

const ProductForm = ({ product }: { product: Product | null }) => {
    const [error, action] = useActionState(
        product == null ? addProduct : updateProduct.bind(null, product.id),
        {}
    );
    const [price, setPrice] = useState<number>(product?.price || 0);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setPrice(Number(value));
        }
    };

    return (
        <>
            <form action={action} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={product?.name || ""}
                        required
                    />
                    {error.name && (
                        <div className="text-destructive">{error.name}</div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price In Rupee</Label>
                    <Input
                        type="text"
                        id="price"
                        name="price"
                        required
                        value={price}
                        onChange={handlePriceChange}
                        style={{
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            appearance: "none",
                        }}
                    />

                    {error.price && (
                        <div className="text-destructive">{error.price}</div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product?.description || ""}
                        required
                    />
                    {error.description && (
                        <div className="text-destructive">
                            {error.description}
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                        type="file"
                        id="file"
                        name="file"
                        required={product == null}
                    />
                    {product != null && (
                        <div className="text-muted-foreground">
                            {product.filePath}
                        </div>
                    )}
                    {error.file && (
                        <div className="text-destructive">{error.file}</div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image">Cover Image</Label>
                    <Input
                        type="file"
                        id="image"
                        name="image"
                        required={product == null}
                    />
                    {product != null && (
                        <Image
                            src={product.imagePath}
                            height={400}
                            width={400}
                            alt="Product Image"
                        />
                    )}
                    {error.image && (
                        <div className="text-destructive">{error.image}</div>
                    )}
                </div>
                <SubmitButton />
            </form>
        </>
    );
};

export default ProductForm;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
        </Button>
    );
}
