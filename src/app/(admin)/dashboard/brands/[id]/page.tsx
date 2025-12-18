"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { useBusinessStore } from "@/lib/store/business-store";
import { Brand } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

export default function EditBrandPage() {
    const router = useRouter();
    const params = useParams();
    const { business } = useBusinessStore();
    const [brand, setBrand] = useState<Brand | null>(null);
    const [saving, setSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        url: "",
        order: 0,
        isActive: true
    });

    useEffect(() => {
        loadBrand();
    }, [params.id, business]);

    const loadBrand = async () => {
        if (!business || !params.id) return;

        try {
            setIsLoading(true);
            const brands = await api.brands.list(business.$id);
            const foundBrand = brands.find((b) => b.$id === params.id);

            if (foundBrand) {
                setBrand(foundBrand);
                setFormData({
                    name: foundBrand.name,
                    logo: foundBrand.logo,
                    url: foundBrand.url || "",
                    order: foundBrand.order,
                    isActive: foundBrand.isActive
                });
            } else {
                toast.error("Marca no encontrada");
                router.push("/dashboard/brands");
            }
        } catch (error: any) {
            console.error("Error loading brand:", error);
            toast.error("Error al cargar la marca");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!brand) return;

        if (!formData.name.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!formData.logo.trim()) {
            toast.error("La URL del logo es requerida");
            return;
        }

        try {
            setSaving(true);
            await api.brands.update(brand.$id, {
                name: formData.name.trim(),
                logo: formData.logo.trim(),
                url: formData.url.trim() || undefined,
                order: formData.order,
                isActive: formData.isActive
            });

            toast.success("Marca actualizada correctamente");
            router.push("/dashboard/brands");
            router.refresh();
        } catch (error: any) {
            console.error("Error updating brand:", error);
            toast.error("Error al actualizar la marca");
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!brand) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/brands">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editar Marca</h2>
                    <p className="text-muted-foreground">
                        Modifica la información de {brand.name}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Marca</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Nike, Adidas, Puma"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logo">
                                URL del Logo <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="logo"
                                type="url"
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                placeholder="https://ejemplo.com/logo.png"
                                required
                            />
                            {formData.logo && (
                                <div className="mt-4 p-6 bg-muted rounded-lg flex items-center justify-center h-40">
                                    <img
                                        src={formData.logo}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                                Sube la imagen a un servicio como Imgur o usa una URL pública
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">
                                URL del Sitio Web (opcional)
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://ejemplo.com"
                            />
                            <p className="text-sm text-muted-foreground">
                                Si se proporciona el logo será clickeable en la landing
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">
                                Orden de Visualización
                            </Label>
                            <Input
                                id="order"
                                type="number"
                                min="0"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-sm text-muted-foreground">
                                Las marcas se ordenan de menor a mayor
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="isActive"
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Marca activa (se mostrará en la landing page)
                            </Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1"
                            >
                                {saving ? (
                                    <>Guardando...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                            <Link href="/dashboard/brands">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
