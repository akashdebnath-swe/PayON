import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { Suspense } from "react";

const getProducts = cache(() => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { name: "asc" },
    });
}, ["/products", "getProducts"]);

export default async function ProductsPage() {
    const products = await getProducts();

    if (products.length == 0) {
        return (
            <div>
                <h1>No products found</h1>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense
                fallback={
                    <>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </>
                }
            >
                <ProductsSuspense products={products} />
            </Suspense>
        </div>
    );
}

async function ProductsSuspense({ products }: { products: Product[] }) {
    return products.map((product) => (
        <ProductCard key={product.id} {...product} />
    ));
}
