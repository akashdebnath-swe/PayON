import { Button } from "@/components/ui/button";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";

// Table from shadcn
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// DropdownMenu from shadcn
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { db } from "@/lib/prisma";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "./_components/ProductActions";

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductsTable />
        </>
    );
}

async function ProductsTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            isAvailableForPurchase: true,
            _count: { select: { Order: true } },
        },
        orderBy: { name: "asc" },
    });

    if (products.length === 0) return <p>No products found</p>;

    return (
        <>
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-0">
                            <span className="sr-only">
                                Available For Purchase
                            </span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead className="w-0">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                {product.isAvailableForPurchase ? (
                                    <>
                                        <CheckCircle2 />
                                        <span className="sr-only">
                                            available
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="stroke-destructive" />
                                        <span className="sr-only">
                                            unavailable
                                        </span>
                                    </>
                                )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {formatCurrency(product.price)}
                            </TableCell>
                            <TableCell>
                                {formatNumber(product._count.Order)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <a
                                                download
                                                href={`/admin/products/${product.id}/download`}
                                            >
                                                Download
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                download
                                                href={`/admin/products/${product.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <ActiveToggleDropdownItem
                                            id={product.id}
                                            isAvailableForPurchase={
                                                product.isAvailableForPurchase
                                            }
                                        />
                                        <DropdownMenuSeparator />
                                        <DeleteDropdownItem
                                            id={product.id}
                                            disabled={product._count.Order > 0}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
