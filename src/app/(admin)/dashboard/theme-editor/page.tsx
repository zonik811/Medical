"use client";

import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme-store";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { THEME_PRESETS, ThemeSettings } from "@/types";
import {
    Loader2,
    Save,
    Palette,
    Type,
    Layout,
    Layers,
    RotateCcw,
    Monitor
} from "lucide-react";

export default function ThemeEditorPage() {
    const { theme, setTheme } = useThemeStore();
    const [saving, setSaving] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID || "";

    // Send initial theme when iframe loads
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            console.log("[Editor] Iframe loaded, sending initial theme");
            setTimeout(() => {
                iframe.contentWindow?.postMessage(
                    {
                        type: "THEME_UPDATE",
                        theme,
                    },
                    "*"
                );
            }, 500);
        };

        iframe.addEventListener("load", handleLoad);
        return () => iframe.removeEventListener("load", handleLoad);
    }, [theme]);

    // Send theme updates in real-time
    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            console.log("[Editor] Sending theme update:", theme);
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "THEME_UPDATE",
                    theme,
                },
                "*"
            );
        }
    }, [theme]);

    // Listen for theme requests from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "REQUEST_THEME") {
                console.log("[Editor] Iframe requested theme, sending...");
                iframeRef.current?.contentWindow?.postMessage(
                    {
                        type: "THEME_UPDATE",
                        theme,
                    },
                    "*"
                );
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [theme]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const existingTheme = await api.business.getTheme(businessId);

            if (existingTheme) {
                await api.business.updateTheme(existingTheme.$id!, theme);
            } else {
                await api.business.createTheme({
                    ...theme,
                    businessId,
                } as any);
            }
            alert("✅ Tema guardado y publicado");
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("❌ Error al guardar el tema");
        } finally {
            setSaving(false);
        }
    };
    const resetTheme = () => {
        if (confirm("¿Estás seguro de que quieres reiniciar todos los cambios?")) {
            // Usa el primer preset disponible
            setTheme(THEME_PRESETS.vibrant.theme); // Reemplaza "vibrant" por el nombre correcto
        }
    };
    const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
        setTheme(THEME_PRESETS[presetKey].theme);
    };



    const colors = [
        {
            label: "Color Primario",
            key: "primaryColor" as const,
            desc: "🎯 Botones principales, hero gradient (inicio), links"
        },
        {
            label: "Color Secundario",
            key: "secondaryColor" as const,
            desc: "🌈 Hero gradient (fin), badge descuento (-30%)"
        },
        {
            label: "Color de Acento",
            key: "accentColor" as const,
            desc: "⭐ Badge 'Popular', efectos hover"
        },
        {
            label: "Fondo Principal",
            key: "backgroundColor" as const,
            desc: "📄 Fondo general de toda la página"
        },
        {
            label: "Fondo Superficie",
            key: "surfaceColor" as const,
            desc: "🔲 Navbar, tarjetas, selector de cantidad"
        },
        {
            label: "Texto Principal",
            key: "textColor" as const,
            desc: "📝 Títulos, nombres de productos, textos principales"
        },
        {
            label: "Texto Secundario",
            key: "mutedColor" as const,
            desc: "💬 Descripciones, subtextos, placeholders"
        },
    ];

    const fontFamilies = [
        { name: "Sistema", value: "system-ui, -apple-system, sans-serif" },
        { name: "Inter", value: "'Inter', sans-serif" },
        { name: "Roboto", value: "'Roboto', sans-serif" },
        { name: "Open Sans", value: "'Open Sans', sans-serif" },
        { name: "Poppins", value: "'Poppins', sans-serif" },
        { name: "Montserrat", value: "'Montserrat', sans-serif" },
        { name: "Lato", value: "'Lato', sans-serif" },
        { name: "Raleway", value: "'Raleway', sans-serif" },
    ];

    const fontSizes = [
        { label: "Muy Pequeño", value: "14px", key: "xs" },
        { label: "Pequeño", value: "16px", key: "sm" },
        { label: "Base", value: "18px", key: "base" },
        { label: "Grande", value: "20px", key: "lg" },
        { label: "Muy Grande", value: "22px", key: "xl" },
    ];

    return (
        <div className="flex h-screen">
            {/* Panel de Controles */}
            <div className="w-[440px] border-r overflow-y-auto bg-background">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Palette className="text-primary" />
                                Editor Visual
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Personaliza la apariencia de tu tienda
                            </p>
                        </div>

                    </div>

                    {/* Tabs para organizar mejor */}
                    <Tabs defaultValue="presets" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="presets" className="text-xs">
                                <Palette className="h-3 w-3 mr-1" />
                                Temas
                            </TabsTrigger>
                            <TabsTrigger value="colors" className="text-xs">
                                <Layers className="h-3 w-3 mr-1" />
                                Colores
                            </TabsTrigger>
                            <TabsTrigger value="typography" className="text-xs">
                                <Type className="h-3 w-3 mr-1" />
                                Texto
                            </TabsTrigger>
                            <TabsTrigger value="layout" className="text-xs">
                                <Layout className="h-3 w-3 mr-1" />
                                Formas
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab: Temas Predefinidos */}
                        <TabsContent value="presets" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">🎨 Temas Predefinidos</CardTitle>
                                    <CardDescription>
                                        Aplica un tema completo de un click
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() =>
                                                applyPreset(key as keyof typeof THEME_PRESETS)
                                            }
                                            className="w-full p-3 border rounded-lg hover:border-primary hover:bg-accent transition-all text-left"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{preset.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {preset.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div
                                                        className="w-5 h-5 rounded-full border-2"
                                                        style={{
                                                            backgroundColor: preset.theme.primaryColor,
                                                        }}
                                                    />
                                                    <div
                                                        className="w-5 h-5 rounded-full border-2"
                                                        style={{
                                                            backgroundColor: preset.theme.secondaryColor,
                                                        }}
                                                    />
                                                    <div
                                                        className="w-5 h-5 rounded-full border-2"
                                                        style={{
                                                            backgroundColor: preset.theme.accentColor,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">💡</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1 text-sm">
                                                Vista Previa en Tiempo Real
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Todos los cambios se reflejan instantáneamente en la vista previa.
                                                Guarda cuando estés satisfecho.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Colores */}
                        <TabsContent value="colors" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">🎨 Colores Personalizados</CardTitle>
                                    <CardDescription>
                                        Ajusta cada color según su función
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {colors.map((color) => (
                                        <div
                                            key={color.key}
                                            className="space-y-2 p-3 rounded-lg border hover:border-primary/50 transition-colors bg-card"
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold">
                                                    {color.label}
                                                </Label>
                                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                                    {theme[color.key]}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {color.desc}
                                            </p>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={theme[color.key]}
                                                    onChange={(e) =>
                                                        setTheme({ [color.key]: e.target.value })
                                                    }
                                                    className="w-20 h-10 cursor-pointer p-1"
                                                />
                                                <Input
                                                    type="text"
                                                    value={theme[color.key]}
                                                    onChange={(e) =>
                                                        setTheme({ [color.key]: e.target.value })
                                                    }
                                                    className="font-mono text-sm flex-1"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Tipografía */}
                        <TabsContent value="typography" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">✍️ Fuente</CardTitle>
                                    <CardDescription>
                                        Selecciona la tipografía de tu tienda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {fontFamilies.map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => setTheme({ fontFamily: font.value })}
                                            className={`w-full p-3 border rounded-lg text-left transition-all ${theme.fontFamily === font.value
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "hover:border-primary/50 hover:bg-accent"
                                                }`}
                                        >
                                            <p
                                                className="font-medium text-lg"
                                                style={{ fontFamily: font.value }}
                                            >
                                                {font.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">
                                                {font.value}
                                            </p>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">📏 Tamaño de Fuente Base</CardTitle>
                                    <CardDescription>
                                        Controla el tamaño del texto en toda la tienda
                                    </CardDescription>
                                </CardHeader>

                            </Card>

                            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">⚠️</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1 text-sm">
                                                Nota sobre fuentes
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Para que las fuentes de Google funcionen correctamente, asegúrate
                                                de incluirlas en tu proyecto. La fuente del Sistema siempre funcionará.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab: Formas y Layout */}
                        <TabsContent value="layout" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">📐 Formas y Esquinas</CardTitle>
                                    <CardDescription>
                                        Controla el redondeo de elementos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">Radio General</Label>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {theme.borderRadius}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Elementos generales de la interfaz
                                        </p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {["0", "0.25rem", "0.5rem", "0.75rem", "1rem"].map(
                                                (val) => (
                                                    <button
                                                        key={val}
                                                        onClick={() =>
                                                            setTheme({ borderRadius: val })
                                                        }
                                                        className={`p-3 border text-xs font-medium transition-all ${theme.borderRadius === val
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-card hover:bg-accent"
                                                            }`}
                                                        style={{ borderRadius: val === "0" ? "0" : val }}
                                                    >
                                                        {val === "0" ? "0" : val.replace("rem", "")}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">Radio Botones</Label>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {theme.buttonRadius}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Botón 'Ver Catálogo', botones +/-
                                        </p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[
                                                "0",
                                                "0.25rem",
                                                "0.5rem",
                                                "0.75rem",
                                                "9999px",
                                            ].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() =>
                                                        setTheme({ buttonRadius: val })
                                                    }
                                                    className={`p-3 border text-xs font-medium transition-all ${theme.buttonRadius === val
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-card hover:bg-accent"
                                                        }`}
                                                    style={{
                                                        borderRadius:
                                                            val === "9999px" ? "9999px" : val,
                                                    }}
                                                >
                                                    {val === "9999px" ? "●" : val === "0" ? "0" : val.replace("rem", "")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">Radio Cards</Label>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {theme.cardRadius}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Tarjetas de productos
                                        </p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[
                                                "0",
                                                "0.5rem",
                                                "0.75rem",
                                                "1rem",
                                                "1.5rem",
                                            ].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setTheme({ cardRadius: val })}
                                                    className={`p-3 border text-xs font-medium transition-all ${theme.cardRadius === val
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-card hover:bg-accent"
                                                        }`}
                                                    style={{ borderRadius: val === "0" ? "0" : val }}
                                                >
                                                    {val === "0" ? "0" : val.replace("rem", "")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Botón Guardar - Sticky */}
                    <div className="sticky bottom-0 bg-background py-4 border-t space-y-2">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full gap-2"
                            size="lg"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Guardar y Publicar
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Los cambios se aplicarán en tu tienda inmediatamente
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-muted p-4">
                <div className="h-full bg-background rounded-lg shadow-2xl overflow-hidden border">
                    <div className="h-12 bg-muted flex items-center px-4 gap-2 border-b">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="flex-1 flex items-center justify-center gap-2">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">
                                Vista Previa en Tiempo Real
                            </span>
                        </div>
                    </div>
                    <iframe
                        ref={iframeRef}
                        src="/?preview=true"
                        className="w-full h-[calc(100%-3rem)] border-0"
                        title="Preview"
                    />
                </div>
            </div>
        </div>
    );
}
