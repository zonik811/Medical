"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DiscountFormProps {
    discountId?: string;
}

interface Product {
    $id: string;
    name: string;
    price: number;
}

export default function DiscountForm({ discountId }: DiscountFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const businessId = "694062d100189a008a18";

    const [formData, setFormData] = useState({
        productId: "",
        originalPrice: 0,
        percentage: 0,
        finalPrice: 0,
    });

    useEffect(() => {
        fetchProducts();
        if (discountId) {
            fetchDiscount();
        }
    }, [discountId]);

    const fetchProducts = async () => {
        try {
            const response = await api.products.list(businessId);
            setProducts(response.documents as any[]);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchDiscount = async () => {
        if (!discountId) return;
        try {
            const discount = await api.discounts.get(discountId);
            setFormData({
                productId: (discount as any).productId,
                originalPrice: (discount as any).originalPrice,
                percentage: (discount as any).percentage,
                finalPrice: (discount as any).finalPrice,
            });
        } catch (error) {
            console.error("Error fetching discount:", error);
        }
    };

    const handleProductChange = (productId: string) => {
        const product = products.find((p) => p.$id === productId);
        if (product) {
            const newOriginalPrice = product.price;
            const newFinalPrice = calculateFinalPrice(newOriginalPrice, formData.percentage);
            setFormData({
                ...formData,
                productId,
                originalPrice: newOriginalPrice,
                finalPrice: newFinalPrice,
            });
        }
    };

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const percentage = Math.min(100, Math.max(0, Number(e.target.value)));
        const newFinalPrice = calculateFinalPrice(formData.originalPrice, percentage);
        setFormData({
            ...formData,
            percentage,
            finalPrice: newFinalPrice,
        });
    };

    const calculateFinalPrice = (originalPrice: number, percentage: number) => {
        return originalPrice - originalPrice * (percentage / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productId) {
            alert("Por favor selecciona un producto");
            return;
        }

        if (formData.percentage <= 0 || formData.percentage > 100) {
            alert("El porcentaje debe estar entre 1 y 100");
            return;
        }

        setLoading(true);
        try {
            const data = {
                businessId,
                productId: formData.productId,
                originalPrice: formData.originalPrice,
                percentage: formData.percentage,
                finalPrice: formData.finalPrice,
            };

            if (discountId) {
                await api.discounts.update(discountId, data);
            } else {
                await api.discounts.create(data);
            }

            router.push("/dashboard/discounts");
        } catch (error) {
            console.error("Error saving discount:", error);
            alert("Error al guardar el descuento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">
                {discountId ? "Editar Descuento" : "Nuevo Descuento"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="product">Producto *</Label>
                    <Select
                        value={formData.productId}
                        onValueChange={handleProductChange}
                        disabled={!!discountId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.$id} value={product.$id}>
                                    {product.name} - ${product.price.toLocaleString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {discountId && (
                        <p className="text-sm text-slate-500">
                            No puedes cambiar el producto al editar
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="originalPrice">Precio Original</Label>
                    <Input
                        id="originalPrice"
                        type="number"
                        value={formData.originalPrice}
                        disabled
                        className="bg-slate-100 dark:bg-slate-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="percentage">Porcentaje de Descuento (%) *</Label>
                    <Input
                        id="percentage"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.percentage}
                        onChange={handlePercentageChange}
                        placeholder="Ej: 20"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="finalPrice">Precio Final</Label>
                    <Input
                        id="finalPrice"
                        type="number"
                        value={formData.finalPrice.toFixed(2)}
                        disabled
                        className="bg-slate-100 dark:bg-slate-800 font-semibold text-green-600 dark:text-green-400"
                    />
                    <p className="text-sm text-slate-500">
                        Ahorro: ${(formData.originalPrice - formData.finalPrice).toFixed(2)}
                    </p>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Guardando..." : discountId ? "Actualizar" : "Crear Descuento"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/discounts")}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
