"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Palette,
    Sun,
    Moon,
    Type,
    Layout,
    Save,
    RotateCcw,
    Eye,
    Copy,
    Check
} from "lucide-react";
import { motion } from "framer-motion";

interface ThemeColors {
    // Base colors
    background: string;
    foreground: string;

    // Card colors
    card: string;
    cardForeground: string;

    // Popover colors
    popover: string;
    popoverForeground: string;

    // Primary colors
    primary: string;
    primaryForeground: string;

    // Secondary colors
    secondary: string;
    secondaryForeground: string;

    // Muted colors
    muted: string;
    mutedForeground: string;

    // Accent colors
    accent: string;
    accentForeground: string;

    // Destructive colors
    destructive: string;
    destructiveForeground: string;

    // Border and input
    border: string;
    input: string;
    ring: string;

    // Radius
    radius: string;
}

const DEFAULT_LIGHT_THEME: ThemeColors = {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    popover: "0 0% 100%",
    popoverForeground: "222.2 84% 4.9%",
    primary: "221.2 83.2% 53.3%",
    primaryForeground: "210 40% 98%",
    secondary: "210 40% 96.1%",
    secondaryForeground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    accent: "210 40% 96.1%",
    accentForeground: "222.2 47.4% 11.2%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "221.2 83.2% 53.3%",
    radius: "0.5rem"
};

const DEFAULT_DARK_THEME: ThemeColors = {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    cardForeground: "210 40% 98%",
    popover: "222.2 84% 4.9%",
    popoverForeground: "210 40% 98%",
    primary: "217.2 91.2% 59.8%",
    primaryForeground: "222.2 47.4% 11.2%",
    secondary: "217.2 32.6% 17.5%",
    secondaryForeground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    mutedForeground: "215 20.2% 65.1%",
    accent: "217.2 32.6% 17.5%",
    accentForeground: "210 40% 98%",
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    input: "217.2 32.6% 17.5%",
    ring: "224.3 76.3% 48%",
    radius: "0.5rem"
};

const PRESET_THEMES = {
    default: {
        name: "Default Blue",
        light: DEFAULT_LIGHT_THEME,
        dark: DEFAULT_DARK_THEME
    },
    medical: {
        name: "Medical Teal",
        light: {
            ...DEFAULT_LIGHT_THEME,
            primary: "173 80% 40%",
            primaryForeground: "0 0% 100%",
            secondary: "173 50% 95%",
            ring: "173 80% 40%"
        },
        dark: {
            ...DEFAULT_DARK_THEME,
            primary: "173 70% 50%",
            ring: "173 70% 50%"
        }
    },
    purple: {
        name: "Purple Dream",
        light: {
            ...DEFAULT_LIGHT_THEME,
            primary: "262 83% 58%",
            primaryForeground: "0 0% 100%",
            secondary: "262 50% 95%",
            ring: "262 83% 58%"
        },
        dark: {
            ...DEFAULT_DARK_THEME,
            primary: "262 70% 60%",
            ring: "262 70% 60%"
        }
    },
    green: {
        name: "Nature Green",
        light: {
            ...DEFAULT_LIGHT_THEME,
            primary: "142 76% 36%",
            primaryForeground: "0 0% 100%",
            secondary: "142 50% 95%",
            ring: "142 76% 36%"
        },
        dark: {
            ...DEFAULT_DARK_THEME,
            primary: "142 70% 45%",
            ring: "142 70% 45%"
        }
    },
    orange: {
        name: "Sunset Orange",
        light: {
            ...DEFAULT_LIGHT_THEME,
            primary: "24 95% 53%",
            primaryForeground: "0 0% 100%",
            secondary: "24 50% 95%",
            ring: "24 95% 53%"
        },
        dark: {
            ...DEFAULT_DARK_THEME,
            primary: "24 90% 55%",
            ring: "24 90% 55%"
        }
    }
};

export default function ThemeEditorPage() {
    const [mode, setMode] = useState<"light" | "dark">("light");
    const [lightTheme, setLightTheme] = useState<ThemeColors>(DEFAULT_LIGHT_THEME);
    const [darkTheme, setDarkTheme] = useState<ThemeColors>(DEFAULT_DARK_THEME);
    const [copied, setCopied] = useState(false);

    const currentTheme = mode === "light" ? lightTheme : darkTheme;
    const setCurrentTheme = mode === "light" ? setLightTheme : setDarkTheme;

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        Object.entries(currentTheme).forEach(([key, value]) => {
            if (key === "radius") {
                root.style.setProperty("--radius", value);
            } else {
                root.style.setProperty(`--${key}`, value);
            }
        });
    }, [currentTheme, mode]);

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        setCurrentTheme(prev => ({ ...prev, [key]: value }));
    };

    const applyPreset = (presetKey: keyof typeof PRESET_THEMES) => {
        const preset = PRESET_THEMES[presetKey];
        setLightTheme(preset.light);
        setDarkTheme(preset.dark);
    };

    const resetToDefault = () => {
        setLightTheme(DEFAULT_LIGHT_THEME);
        setDarkTheme(DEFAULT_DARK_THEME);
    };

    const exportTheme = () => {
        const css = `
/* Light Mode */
.light {
${Object.entries(lightTheme).map(([key, value]) =>
            `  --${key}: ${value};`
        ).join('\n')}
}

/* Dark Mode */
.dark {
${Object.entries(darkTheme).map(([key, value]) =>
            `  --${key}: ${value};`
        ).join('\n')}
}
    `.trim();

        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const ColorInput = ({
        label,
        value,
        onChange,
        description
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        description?: string;
    }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{label}</Label>
                <div
                    className="w-8 h-8 rounded border-2 border-border shadow-sm"
                    style={{ backgroundColor: `hsl(${value})` }}
                />
            </div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="hue saturation lightness"
                className="font-mono text-xs"
            />
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editor de Tema</h2>
                    <p className="text-muted-foreground">
                        Personaliza los colores y estilos de tu aplicación
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMode(mode === "light" ? "dark" : "light")}
                    >
                        {mode === "light" ? (
                            <><Sun className="w-4 h-4 mr-2" /> Claro</>
                        ) : (
                            <><Moon className="w-4 h-4 mr-2" /> Oscuro</>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToDefault}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reiniciar
                    </Button>
                    <Button
                        size="sm"
                        onClick={exportTheme}
                    >
                        {copied ? (
                            <><Check className="w-4 h-4 mr-2" /> Copiado</>
                        ) : (
                            <><Copy className="w-4 h-4 mr-2" /> Exportar CSS</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Editor Panel */}
                <div className="space-y-6">
                    {/* Presets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Temas Predefinidos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(PRESET_THEMES).map(([key, preset]) => (
                                    <Button
                                        key={key}
                                        variant="outline"
                                        onClick={() => applyPreset(key as any)}
                                        className="justify-start"
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{
                                                backgroundColor: `hsl(${mode === "light" ? preset.light.primary : preset.dark.primary})`
                                            }}
                                        />
                                        {preset.name}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Color Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Personalización de Colores - Modo {mode === "light" ? "Claro" : "Oscuro"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="base" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="base">Base</TabsTrigger>
                                    <TabsTrigger value="brand">Marca</TabsTrigger>
                                    <TabsTrigger value="text">Texto</TabsTrigger>
                                    <TabsTrigger value="other">Otros</TabsTrigger>
                                </TabsList>

                                <TabsContent value="base" className="space-y-4 mt-4">
                                    <ColorInput
                                        label="Background"
                                        value={currentTheme.background}
                                        onChange={(v) => handleColorChange("background", v)}
                                        description="Fondo principal de la aplicación"
                                    />
                                    <ColorInput
                                        label="Card"
                                        value={currentTheme.card}
                                        onChange={(v) => handleColorChange("card", v)}
                                        description="Fondo de tarjetas y elementos elevados"
                                    />
                                    <ColorInput
                                        label="Muted"
                                        value={currentTheme.muted}
                                        onChange={(v) => handleColorChange("muted", v)}
                                        description="Fondos secundarios y atenuados"
                                    />
                                </TabsContent>

                                <TabsContent value="brand" className="space-y-4 mt-4">
                                    <ColorInput
                                        label="Primary"
                                        value={currentTheme.primary}
                                        onChange={(v) => handleColorChange("primary", v)}
                                        description="Color principal de la marca"
                                    />
                                    <ColorInput
                                        label="Primary Foreground"
                                        value={currentTheme.primaryForeground}
                                        onChange={(v) => handleColorChange("primaryForeground", v)}
                                        description="Texto sobre color primario"
                                    />
                                    <ColorInput
                                        label="Secondary"
                                        value={currentTheme.secondary}
                                        onChange={(v) => handleColorChange("secondary", v)}
                                        description="Color secundario de la marca"
                                    />
                                    <ColorInput
                                        label="Secondary Foreground"
                                        value={currentTheme.secondaryForeground}
                                        onChange={(v) => handleColorChange("secondaryForeground", v)}
                                        description="Texto sobre color secundario"
                                    />
                                </TabsContent>

                                <TabsContent value="text" className="space-y-4 mt-4">
                                    <ColorInput
                                        label="Foreground"
                                        value={currentTheme.foreground}
                                        onChange={(v) => handleColorChange("foreground", v)}
                                        description="Texto principal"
                                    />
                                    <ColorInput
                                        label="Muted Foreground"
                                        value={currentTheme.mutedForeground}
                                        onChange={(v) => handleColorChange("mutedForeground", v)}
                                        description="Texto secundario y atenuado"
                                    />
                                    <ColorInput
                                        label="Card Foreground"
                                        value={currentTheme.cardForeground}
                                        onChange={(v) => handleColorChange("cardForeground", v)}
                                        description="Texto sobre tarjetas"
                                    />
                                    <ColorInput
                                        label="Accent Foreground"
                                        value={currentTheme.accentForeground}
                                        onChange={(v) => handleColorChange("accentForeground", v)}
                                        description="Texto sobre elementos destacados"
                                    />
                                </TabsContent>

                                <TabsContent value="other" className="space-y-4 mt-4">
                                    <ColorInput
                                        label="Border"
                                        value={currentTheme.border}
                                        onChange={(v) => handleColorChange("border", v)}
                                        description="Color de bordes"
                                    />
                                    <ColorInput
                                        label="Input"
                                        value={currentTheme.input}
                                        onChange={(v) => handleColorChange("input", v)}
                                        description="Fondo de campos de entrada"
                                    />
                                    <ColorInput
                                        label="Ring"
                                        value={currentTheme.ring}
                                        onChange={(v) => handleColorChange("ring", v)}
                                        description="Anillo de enfoque"
                                    />
                                    <ColorInput
                                        label="Destructive"
                                        value={currentTheme.destructive}
                                        onChange={(v) => handleColorChange("destructive", v)}
                                        description="Color para acciones destructivas"
                                    />
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Border Radius</Label>
                                        <Input
                                            value={currentTheme.radius}
                                            onChange={(e) => handleColorChange("radius", e.target.value)}
                                            placeholder="0.5rem"
                                            className="font-mono text-xs"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Radio de bordes (rem o px)
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Vista Previa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Buttons Preview */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Botones</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm">Primary</Button>
                                    <Button size="sm" variant="secondary">Secondary</Button>
                                    <Button size="sm" variant="outline">Outline</Button>
                                    <Button size="sm" variant="ghost">Ghost</Button>
                                    <Button size="sm" variant="destructive">Destructive</Button>
                                </div>
                            </div>

                            {/* Card Preview */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Tarjetas</Label>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Card Title</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Esta es una tarjeta de ejemplo con texto principal y secundario.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Text Preview */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Tipografía</Label>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-bold">Heading 1</h1>
                                    <h2 className="text-xl font-semibold">Heading 2</h2>
                                    <p className="text-base">Texto regular normal</p>
                                    <p className="text-sm text-muted-foreground">
                                        Texto secundario con menor jerarquía
                                    </p>
                                </div>
                            </div>

                            {/* Input Preview */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Inputs</Label>
                                <Input placeholder="Campo de texto de ejemplo" />
                            </div>

                            {/* Colors Palette */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Paleta de Colores</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded border"
                                            style={{ backgroundColor: `hsl(${currentTheme.primary})` }}
                                        />
                                        <p className="text-xs text-center">Primary</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded border"
                                            style={{ backgroundColor: `hsl(${currentTheme.secondary})` }}
                                        />
                                        <p className="text-xs text-center">Secondary</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded border"
                                            style={{ backgroundColor: `hsl(${currentTheme.muted})` }}
                                        />
                                        <p className="text-xs text-center">Muted</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded border"
                                            style={{ backgroundColor: `hsl(${currentTheme.destructive})` }}
                                        />
                                        <p className="text-xs text-center">Destructive</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">💡</div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-semibold">Formato HSL</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Los colores se definen en formato HSL (Hue Saturation Lightness).
                                        Ejemplo: <code className="bg-muted px-1 rounded">221.2 83.2% 53.3%</code>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        • Hue (0-360): Tono del color<br />
                                        • Saturation (0-100%): Saturación<br />
                                        • Lightness (0-100%): Luminosidad
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
