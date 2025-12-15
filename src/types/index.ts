// Extended theme settings interface
export interface ThemeSettings {
    $id?: string;
    businessId?: string;

    // Colores Base
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    mutedColor: string;

    // Formas y Radios
    borderRadius: string;
    buttonRadius: string;
    cardRadius: string;

    // Estilos de Componentes
    buttonStyle: 'solid' | 'outline' | 'ghost';
    buttonSize: 'sm' | 'md' | 'lg';
    cardStyle: 'elevated' | 'outlined' | 'filled';
    badgeStyle: 'solid' | 'outline' | 'subtle';

    // Sombras
    shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';

    // Legacy campos (mantener compatibilidad)
    fontFamily?: string;
}

// 5 Paletas Predefinidas Profesionales
export const THEME_PRESETS = {
    vibrant: {
        name: "Vibrant",
        description: "Colores vibrantes y energéticos",
        theme: {
            primaryColor: "#FF6B6B",
            secondaryColor: "#4ECDC4",
            accentColor: "#FFE66D",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F8F9FA",
            textColor: "#2C3E50",
            mutedColor: "#6C757D",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    },
    dark: {
        name: "Dark Mode",
        description: "Elegante tema oscuro",
        theme: {
            primaryColor: "#3B82F6",
            secondaryColor: "#8B5CF6",
            accentColor: "#10B981",
            backgroundColor: "#0F172A",
            surfaceColor: "#1E293B",
            textColor: "#F1F5F9",
            mutedColor: "#94A3B8",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "strong" as const,
        }
    },
    minimal: {
        name: "Minimal",
        description: "Diseño limpio y minimalista",
        theme: {
            primaryColor: "#000000",
            secondaryColor: "#6B7280",
            accentColor: "#3B82F6",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#FAFAFA",
            textColor: "#111827",
            mutedColor: "#9CA3AF",
            borderRadius: "0.25rem",
            buttonRadius: "0.25rem",
            cardRadius: "0.5rem",
            buttonStyle: "outline" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "outline" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    nature: {
        name: "Nature",
        description: "Inspirado en la naturaleza",
        theme: {
            primaryColor: "#10B981",
            secondaryColor: "#059669",
            accentColor: "#F59E0B",
            backgroundColor: "#F0FDF4",
            surfaceColor: "#FFFFFF",
            textColor: "#064E3B",
            mutedColor: "#6B7280",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    sunset: {
        name: "Sunset",
        description: "Cálidos tonos de atardecer",
        theme: {
            primaryColor: "#F59E0B",
            secondaryColor: "#EF4444",
            accentColor: "#EC4899",
            backgroundColor: "#FFF7ED",
            surfaceColor: "#FFFFFF",
            textColor: "#78350F",
            mutedColor: "#92400E",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    }
} as const;

export const DEFAULT_THEME: ThemeSettings = THEME_PRESETS.vibrant.theme;

// Otros tipos existentes
export interface Business {
    $id: string;
    name: string;
    slug: string;
    whatsapp?: string;
    logoUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    taxRate?: number;
    shippingCost?: number;
    description?: string;
    isActive: boolean;
    ownerId: string;
}

export interface Category {
    $id: string;
    businessId: string;
    name: string;
    faqs: { question: string; answer: string }[];
}

export interface Product {
    $id: string;
    businessId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isAvailable: boolean;
    originalPrice?: number;
    discountPercentage?: number;
}

export interface Discount {
    $id: string;
    businessId: string;
    productId: string;
    originalPrice: number;
    percentage: number;
    finalPrice: number;
}
