"use client";

import { useThemeStore } from "@/lib/store/theme-store";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

export function ThemeEditor() {
    const { theme, setTheme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Check if theme exists for this business (demo)
            const existingTheme = await api.business.getTheme('demo');

            if (existingTheme) {
                await api.business.updateTheme(existingTheme.$id!, { // ← Agregar !
                    primaryColor: theme.primaryColor,
                    secondaryColor: theme.secondaryColor,
                    backgroundColor: theme.backgroundColor,
                    surfaceColor: theme.surfaceColor,
                    textColor: theme.textColor,
                    borderRadius: theme.borderRadius
                });
            }
            else {
                await api.business.createTheme({
                    ...theme,
                    businessId: 'demo'
                } as any);
            }
            alert("Tema guardado correctamente");
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("Error al guardar el tema");
        } finally {
            setIsSaving(false);
        }
    };

    const colors = [
        { label: 'Primary', key: 'primaryColor' as const },
        { label: 'Secondary', key: 'secondaryColor' as const },
        { label: 'Background', key: 'backgroundColor' as const },
        { label: 'Surface', key: 'surfaceColor' as const },
        { label: 'Text', key: 'textColor' as const },
    ];

    const radiusOptions = [
        { label: '0px', value: '0' },
        { label: '4px', value: '0.25rem' },
        { label: '8px', value: '0.5rem' },
        { label: '16px', value: '1rem' },
        { label: 'Full', value: '9999px' },
    ];

    return (
        <>
            <Button
                size="icon"
                className="fixed bottom-4 left-4 z-50 bg-slate-800 text-white"
                onClick={() => setIsOpen(true)}
            >
                <Settings size={24} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 border-r overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Editor Visual</h2>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X size={24} />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Colores</h3>
                                {colors.map((color) => (
                                    <div key={color.key} className="space-y-2">
                                        <label className="text-xs font-medium block">{color.label}</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={theme[color.key]}
                                                onChange={(e) => setTheme({ [color.key]: e.target.value })}
                                                className="h-8 w-12 cursor-pointer border rounded"
                                            />
                                            <input
                                                type="text"
                                                value={theme[color.key]}
                                                onChange={(e) => setTheme({ [color.key]: e.target.value })}
                                                className="flex-1 text-xs p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Estilos</h3>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium block">Radio Borde</label>
                                    <div className="grid grid-cols-5 gap-1">
                                        {radiusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setTheme({ borderRadius: opt.value })}
                                                className={`text-[10px] p-1 border rounded ${theme.borderRadius === opt.value ? 'bg-primary text-white' : 'bg-slate-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
