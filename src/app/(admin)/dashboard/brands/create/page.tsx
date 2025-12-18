"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, X, ImagePlus } from "lucide-react";
import { api } from "@/services/api";
import { useBusinessStore } from "@/lib/store/business-store";
import { storage, appwriteConfig } from "@/lib/appwrite";
import { ID } from "appwrite";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateBrandPage() {
    const router = useRouter();
    const { business } = useBusinessStore();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        url: "",
        order: 0,
        isActive: true
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Por favor selecciona una imagen");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("La imagen no puede ser mayor a 5MB");
            return;
        }

        try {
            setUploading(true);
            const response = await storage.createFile(
                appwriteConfig.buckets.brandLogos,
                ID.unique(),
                file
            );

            const fileUrl = storage.getFileView(
                appwriteConfig.buckets.brandLogos,
                response.$id
            );

            setFormData({ ...formData, logo: fileUrl.toString() });
            toast.success("Imagen subida correctamente");
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFormData({ ...formData, logo: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!business) {
            toast.error("No se encontró el negocio");
            return;
        }

        if (!formData.name.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!formData.logo.trim()) {
            toast.error("El logo es requerido");
            return;
        }

        try {
            setSaving(true);
            await api.brands.create({
                businessId: business.$id,
                name: formData.name.trim(),
                logo: formData.logo.trim(),
                url: formData.url.trim() || undefined,
                order: formData.order,
                isActive: formData.isActive
            });

            toast.success("Marca creada correctamente");
            router.push("/dashboard/brands");
            router.refresh();
        } catch (error: any) {
            console.error("Error creating brand:", error);
            toast.error("Error al crear la marca");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/brands">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nueva Marca</h2>
                    <p className="text-muted-foreground">
                        Agrega una nueva marca para mostrar en la landing page
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
                            <Label>
                                Logo de la Marca <span className="text-red-500">*</span>
                            </Label>

                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                {formData.logo ? (
                                    <div className="space-y-4">
                                        <div className="bg-muted rounded-lg p-6 flex items-center justify-center h-40">
                                            <img
                                                src={formData.logo}
                                                alt="Preview"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                className="flex-1"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Eliminar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                                disabled={uploading}
                                                className="flex-1"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Cambiar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="rounded-full bg-primary/10 p-4">
                                                <ImagePlus className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {uploading ? "Subiendo imagen..." : "Click para subir imagen"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PNG, JPG, SVG (max. 5MB)
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </div>

                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={uploading}
                            />

                            <p className="text-sm text-muted-foreground">
                                O ingresa una URL directamente:
                            </p>
                            <Input
                                type="url"
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                placeholder="https://ejemplo.com/logo.png"
                                disabled={uploading}
                            />
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
                                Si se proporciona, el logo será clickeable en la landing
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
                                disabled={saving || uploading}
                                className="flex-1"
                            >
                                {saving ? (
                                    <>Guardando...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Crear Marca
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
