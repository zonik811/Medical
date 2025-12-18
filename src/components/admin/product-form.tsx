"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { api } from "@/services/api";
import { Loader2, Upload, Plus, HelpCircle } from "lucide-react";
import { createProductTour, startTour } from "@/lib/tours";

interface ProductFormProps {
    initialData?: Product;
    businessId: string;
    onSuccess?: () => void;
}

export function ProductForm({ initialData, businessId, onSuccess }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        isAvailable: true,
        businessId
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        loadCategories();
    }, [businessId]);

    const loadCategories = async () => {
        try {
            const response = await api.categories.list(businessId);
            setCategories(response.documents as unknown as Category[]);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsLoading(true);
        try {
            const newCat = await api.categories.create({
                businessId,
                name: newCategoryName.trim(),
                slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-') // Simple slug gen
            });
            setCategories([...categories, newCat as unknown as Category]);
            setFormData({ ...formData, categoryId: newCat.$id });
            setIsNewCategory(false);
            setNewCategoryName("");
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Error al crear categoría");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = formData.imageUrl;

            if (imageFile) {
                const uploaded = await api.products.uploadImage(imageFile);
                imageUrl = api.products.getImageView(uploaded.$id);
            }

            const dataToSave = {
                ...formData,
                imageUrl,
                price: Number(formData.price),
                // Ensure categoryId is set. If allow new category inline creation without explicit save, handle here.
                // But we handle it via handleCreateCategory.
            } as Omit<Product, '$id'>;

            if (initialData?.$id) {
                await api.products.update(initialData.$id, dataToSave);
            } else {
                await api.products.create(dataToSave);
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error al guardar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm">
            <div className="space-y-2" data-tour="product-name">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                    id="name"
                    placeholder="Ej: Hamburguesa Clásica"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2" data-tour="product-description">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    placeholder="Describe los ingredientes y detalles..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" data-tour="product-price">
                    <Label htmlFor="price">Precio</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                            id="price"
                            type="number"
                            className="pl-7"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2" data-tour="product-category">
                    <Label>Categoría</Label>
                    {isNewCategory ? (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nueva categoría..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <Button type="button" size="sm" onClick={handleCreateCategory} disabled={isLoading}>
                                OK
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewCategory(false)}>
                                X
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Select
                                value={formData.categoryId}
                                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.$id} value={cat.$id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setIsNewCategory(true)}
                                title="Crear nueva categoría"
                                data-tour="category-create"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2" data-tour="product-image">
                <Label>Imagen del Producto</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative h-40">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {imageFile ? (
                        <div className="text-center">
                            <p className="text-sm font-medium text-primary">{imageFile.name}</p>
                            <p className="text-xs text-muted-foreground">Click para cambiar</p>
                        </div>
                    ) : formData.imageUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img src={formData.imageUrl} alt="Preview" className="h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-white text-sm">Click para cambiar</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-500">Click para subir imagen</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2" data-tour="product-available">
                <Checkbox
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked as boolean })}
                />
                <Label htmlFor="available" className="cursor-pointer">
                    Producto Disponible
                </Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full" data-tour="submit-product">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {initialData ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
        </form>
    );
}
