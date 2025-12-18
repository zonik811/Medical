"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, FolderTree } from "lucide-react";
import { api } from "@/services/api";
import { useBusinessStore } from "@/lib/store/business-store";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
    $id: string;
    businessId: string;
    name: string;
    slug: string;
    description?: string;
    $createdAt: string;
    $updatedAt: string;
}

export default function CategoriesPage() {
    const router = useRouter();
    const { business } = useBusinessStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        loadCategories();
    }, [business]);

    const loadCategories = async () => {
        if (!business) return;

        try {
            setIsLoading(true);
            const response = await api.categories.list(business.$id);
            setCategories(response.documents as unknown as Category[]);

            // Load product counts for each category
            const products = await api.products.list(business.$id);
            const counts: Record<string, number> = {};

            response.documents.forEach((cat: any) => {
                const count = products.documents.filter((p: any) => p.categoryId === cat.$id).length;
                counts[cat.$id] = count;
            });

            setProductCounts(counts);
        } catch (error) {
            console.error("Error loading categories:", error);
            toast.error("Error al cargar las categorías");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const productCount = productCounts[id] || 0;

        if (productCount > 0) {
            toast.error(
                `No puedes eliminar "${name}" porque ${productCount} producto${productCount > 1 ? 's' : ''} la está${productCount > 1 ? 'n' : ''} usando`,
                { duration: 4000 }
            );
            return;
        }

        if (!confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
            return;
        }

        try {
            setDeletingId(id);
            await api.categories.delete(id);
            toast.success("Categoría eliminada correctamente");
            loadCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Error al eliminar la categoría");
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
                    <p className="text-muted-foreground">
                        Gestiona las categorías de tus productos
                    </p>
                </div>
                <Link href="/dashboard/categories/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Categoría
                    </Button>
                </Link>
            </div>

            {categories.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderTree className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Crea tu primera categoría para organizar tus productos
                        </p>
                        <Link href="/dashboard/categories/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Primera Categoría
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card key={category.$id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <FolderTree className="w-5 h-5 text-primary" />
                                            <span>{category.name}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-normal mt-1">
                                            {category.slug}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {category.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {productCounts[category.$id] || 0} producto{productCounts[category.$id] !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Link href={`/dashboard/categories/${category.$id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(category.$id, category.name)}
                                        disabled={deletingId === category.$id}
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        {deletingId === category.$id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {categories.length > 0 && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <FolderTree className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Sobre las categorías</h3>
                                <p className="text-sm text-muted-foreground">
                                    Las categorías te permiten organizar tus productos. Los clientes pueden filtrar productos por categoría en la tienda.
                                    {" "}
                                    <strong>No puedes eliminar una categoría</strong> si tiene productos asignados.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
