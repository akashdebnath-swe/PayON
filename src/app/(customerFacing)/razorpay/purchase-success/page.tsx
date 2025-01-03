import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SuccessPage() {
    const isSuccess = true;
    return (
        <div className="max-w-5xl w-full mx-auto space-y-8">
            <h1 className="text-4xl font-bold">
                {isSuccess ? "Success!" : "Error!"}
            </h1>
            <div className="flex gap-4 items-center">
                <div className="aspect-video flex-shrink-0 w-1/3 relative">
                    <Image
                        src={product.imagePath}
                        fill
                        alt={product.name}
                        className="object-cover"
                    />
                </div>
                <div>
                    <div className="text-lg">
                        {formatCurrency(product.price)}
                    </div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="line-clamp-3 text-muted-foreground">
                        {product.description}
                    </div>
                    <Button className="mt-4" size="lg" asChild>
                        {isSuccess ? (
                            <a
                                href={`/products/download/${await createDownloadVerification(
                                    product.id
                                )}`}
                            >
                                Download
                            </a>
                        ) : (
                            <Link href={`/products/${product.id}/purchase`}>
                                Try Again
                            </Link>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

async function createDownloadVerification(productId: string) {
    return (
        await db.downloadVerification.create({
            data: {
                productId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        })
    ).id;
}
