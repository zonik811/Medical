"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { business } = useBusinessStore();
    const [category, setCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: ""
    });

    useEffect(() => {
        loadCategory();
    }, [params.id, business]);

    const loadCategory = async () => {
        if (!business || !params.id) return;

        try {
            setIsLoading(true);
            const cat = await api.categories.get(params.id as string);
            const categoryData = cat as unknown as Category;

            setCategory(categoryData);
            setFormData({
                name: categoryData.name,
                slug: categoryData.slug,
                description: categoryData.description || ""
            });
        } catch (error: any) {
            console.error("Error loading category:", error);
            toast.error("Error al cargar la categoría");
            router.push("/dashboard/categories");
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
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

        if (!category) return;

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
            await api.categories.update(category.$id, {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined
            });

            toast.success("Categoría actualizada correctamente");
            router.push("/dashboard/categories");
            router.refresh();
        } catch (error: any) {
            console.error("Error updating category:", error);
            toast.error("Error al actualizar la categoría");
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

    if (!category) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editar Categoría</h2>
                    <p className="text-muted-foreground">
                        Modifica la información de {category.name}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Categoría</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
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

                        <div className="space-y-2">
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
