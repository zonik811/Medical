"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";
import { api } from "@/services/api";
import { useBusinessStore } from "@/lib/store/business-store";
import { toast } from "sonner";
import Link from "next/link";
import { createCategoryTour, startTour } from "@/lib/tours";

export default function CreateCategoryPage() {
    const router = useRouter();
    const { business } = useBusinessStore();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: ""
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-") // Replace multiple hyphens with single
            .trim();
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
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

        if (!formData.slug.trim()) {
            toast.error("El slug es requerido");
            return;
        }

        try {
            setSaving(true);
            await api.categories.create({
                businessId: business.$id,
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined
            });

            toast.success("Categoría creada correctamente");
            router.push("/dashboard/categories");
            router.refresh();
        } catch (error: any) {
            console.error("Error creating category:", error);
            toast.error("Error al crear la categoría");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/categories">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Nueva Categoría</h2>
                        <p className="text-muted-foreground">
                            Crea una nueva categoría para organizar tus productos
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startTour(createCategoryTour)}
                    title="Ver guía de creación"
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Categoría</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2" data-tour="category-name">
                            <Label htmlFor="name">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Ej: Electrodomésticos, Ropa, Alimentos"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                El nombre que verán los clientes
                            </p>
                        </div>

                        <div className="space-y-2" data-tour="category-slug">
                            <Label htmlFor="slug">
                                Slug (URL) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="electrodomesticos"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Se genera automáticamente del nombre. Usa solo letras minúsculas, números y guiones
                            </p>
                        </div>

                        <div className="space-y-2" data-tour="category-description">
                            <Label htmlFor="description">
                                Descripción (opcional)
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe esta categoría..."
                                rows={4}
                            />
                            <p className="text-sm text-muted-foreground">
                                Una breve descripción de esta categoría
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1"
                                data-tour="submit-category"
                            >
                                {saving ? (
                                    <>Guardando...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Crear Categoría
                                    </>
                                )}
                            </Button>
                            <Link href="/dashboard/categories">
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
