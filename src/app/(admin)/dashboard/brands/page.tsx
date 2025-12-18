"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { api } from "@/services/api";
import { useBusinessStore } from "@/lib/store/business-store";
import { Brand } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

export default function BrandsPage() {
    const router = useRouter();
    const { business } = useBusinessStore();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBrands();
    }, [business]);

    const loadBrands = async () => {
        if (!business) return;

        try {
            setIsLoading(true);
            const data = await api.brands.list(business.$id);
            setBrands(data);
        } catch (error: any) {
            console.error("Error loading brands:", error);
            toast.error("Error al cargar las marcas");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar la marca "${name}"?`)) {
            return;
        }

        try {
            await api.brands.delete(id);
            toast.success("Marca eliminada correctamente");
            loadBrands();
        } catch (error: any) {
            console.error("Error deleting brand:", error);
            toast.error("Error al eliminar la marca");
        }
    };

    const toggleActive = async (brand: Brand) => {
        try {
            await api.brands.update(brand.$id, {
                isActive: !brand.isActive
            });
            toast.success(brand.isActive ? "Marca desactivada" : "Marca activada");
            loadBrands();
        } catch (error: any) {
            console.error("Error toggling brand:", error);
            toast.error("Error al actualizar la marca");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Cargando marcas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Marcas</h2>
                    <p className="text-muted-foreground">
                        Gestiona los logos de marcas que se muestran en la landing page
                    </p>
                </div>
                <Link href="/dashboard/brands/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Marca
                    </Button>
                </Link>
            </div>

            {brands.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <div className="text-center text-muted-foreground">
                            <p className="mb-4">No hay marcas registradas</p>
                            <Link href="/dashboard/brands/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear primera marca
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {brands.map((brand) => (
                        <Card key={brand.$id} className={!brand.isActive ? "opacity-50" : ""}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                        Orden: {brand.order}
                                    </div>
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {brand.url && (
                                        <a
                                            href={brand.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted rounded-lg p-6 flex items-center justify-center h-32">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold">{brand.name}</p>
                                    {brand.url && (
                                        <p className="text-xs text-muted-foreground truncate mt-1">
                                            {brand.url}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => router.push(`/dashboard/brands/${brand.$id}`)}
                                    >
                                        <Pencil className="w-3 h-3 mr-1" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant={brand.isActive ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => toggleActive(brand)}
                                    >
                                        {brand.isActive ? "Desactivar" : "Activar"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(brand.$id, brand.name)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">Sobre las marcas</h3>
                            <p className="text-sm text-muted-foreground">
                                Las marcas aparecen en la sección Marcas de la landing page en un carrusel animado.
                                El orden determina la posición en el carrusel. Solo las marcas activas se mostrarán.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
