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
            primaryColor: "#E63946",
            secondaryColor: "#06A77D",
            accentColor: "#F4A261",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F8F9FA",
            textColor: "#1A1A1A",
            mutedColor: "#5A5A5A",
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
            primaryColor: "#60A5FA",
            secondaryColor: "#A78BFA",
            accentColor: "#34D399",
            backgroundColor: "#0F172A",
            surfaceColor: "#1E293B",
            textColor: "#F1F5F9",
            mutedColor: "#CBD5E1",
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
            primaryColor: "#171717",
            secondaryColor: "#525252",
            accentColor: "#2563EB",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#FAFAFA",
            textColor: "#0A0A0A",
            mutedColor: "#737373",
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
            primaryColor: "#059669",
            secondaryColor: "#047857",
            accentColor: "#F59E0B",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F0FDF4",
            textColor: "#052E16",
            mutedColor: "#4B5563",
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
            primaryColor: "#DC2626",
            secondaryColor: "#EA580C",
            accentColor: "#DB2777",
            backgroundColor: "#FFFBEB",
            surfaceColor: "#FFFFFF",
            textColor: "#451A03",
            mutedColor: "#78350F",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    },
    medicalBlue: {
        name: "Medical Blue",
        description: "Profesional y confiable para sector salud",
        theme: {
            primaryColor: "#0369A1",
            secondaryColor: "#0284C7",
            accentColor: "#0891B2",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F0F9FF",
            textColor: "#0C4A6E",
            mutedColor: "#475569",
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
    corporatePro: {
        name: "Corporate Pro",
        description: "Formal y profesional para empresas",
        theme: {
            primaryColor: "#1E40AF",
            secondaryColor: "#3B82F6",
            accentColor: "#60A5FA",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F8FAFC",
            textColor: "#0F172A",
            mutedColor: "#475569",
            borderRadius: "0.375rem",
            buttonRadius: "0.375rem",
            cardRadius: "0.5rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    luxuryGold: {
        name: "Luxury Gold",
        description: "Elegante y premium con toques dorados",
        theme: {
            primaryColor: "#B45309",
            secondaryColor: "#92400E",
            accentColor: "#D97706",
            backgroundColor: "#FFFBEB",
            surfaceColor: "#FFFFFF",
            textColor: "#451A03",
            mutedColor: "#78350F",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "lg" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "strong" as const,
        }
    },
    oceanFresh: {
        name: "Ocean Fresh",
        description: "Colores frescos y marinos",
        theme: {
            primaryColor: "#0891B2",
            secondaryColor: "#06B6D4",
            accentColor: "#22D3EE",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#ECFEFF",
            textColor: "#083344",
            mutedColor: "#475569",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1.5rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    forestGreen: {
        name: "Forest Green",
        description: "Verde natural y relajante",
        theme: {
            primaryColor: "#15803D",
            secondaryColor: "#16A34A",
            accentColor: "#22C55E",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F0FDF4",
            textColor: "#052E16",
            mutedColor: "#374151",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    cherryBlossom: {
        name: "Cherry Blossom",
        description: "Suaves tonos rosados y románticos",
        theme: {
            primaryColor: "#DB2777",
            secondaryColor: "#EC4899",
            accentColor: "#F472B6",
            backgroundColor: "#FFF1F2",
            surfaceColor: "#FFFFFF",
            textColor: "#4C0519",
            mutedColor: "#831843",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1.25rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    lavenderDreams: {
        name: "Lavender Dreams",
        description: "Paleta morada suave y elegante",
        theme: {
            primaryColor: "#7C3AED",
            secondaryColor: "#8B5CF6",
            accentColor: "#A78BFA",
            backgroundColor: "#FEFCE8",
            surfaceColor: "#FFFFFF",
            textColor: "#3B0764",
            mutedColor: "#6B21A8",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    monochrome: {
        name: "Monochrome",
        description: "Clásico blanco y negro minimalista",
        theme: {
            primaryColor: "#171717",
            secondaryColor: "#404040",
            accentColor: "#525252",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#FAFAFA",
            textColor: "#0A0A0A",
            mutedColor: "#737373",
            borderRadius: "0rem",
            buttonRadius: "0rem",
            cardRadius: "0rem",
            buttonStyle: "outline" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "outline" as const,
            shadowIntensity: "none" as const,
        }
    },
    neonNight: {
        name: "Neon Night",
        description: "Vibrante y futurista estilo neón",
        theme: {
            primaryColor: "#C084FC",
            secondaryColor: "#F472B6",
            accentColor: "#FB923C",
            backgroundColor: "#18181B",
            surfaceColor: "#27272A",
            textColor: "#FAFAFA",
            mutedColor: "#D4D4D8",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "strong" as const,
        }
    },
    warmEarth: {
        name: "Warm Earth",
        description: "Tonos tierra cálidos y acogedores",
        theme: {
            primaryColor: "#92400E",
            secondaryColor: "#B45309",
            accentColor: "#D97706",
            backgroundColor: "#FFFBEB",
            surfaceColor: "#FFFFFF",
            textColor: "#431407",
            mutedColor: "#78350F",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
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
    stock?: number; // Merged from inventory collection
}

export interface Discount {
    $id: string;
    businessId: string;
    productId: string;
    originalPrice: number;
    percentage: number;
    finalPrice: number;
}

export interface Inventory {
    $id: string;
    businessId: string;
    productId: string;
    stock: number;
    minStock?: number;
    maxStock?: number;
}

export interface Order {
    $id: string;
    businessId: string;
    orderNumber: string;
    customerName?: string;
    customerPhone?: string;
    total: number;
    itemsCount: number;
    status: 'pending' | 'completed' | 'cancelled';
    $createdAt: string;
    $updatedAt: string;
}

export interface OrderItem {
    $id: string;
    orderId: string;
    businessId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    $createdAt: string;
}

export interface CreateOrderData {
    businessId: string;
    customerName?: string;
    customerPhone?: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
    total: number;
    itemsCount: number;
}

export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    topProducts: {
        productId: string;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
    }[];
}

// ========================================
// LANDING PAGE TYPES
// ========================================

export interface LandingConfig {
    $id: string;
    businessId: string;
    config: {
        // Hero Section
        hero: {
            title: string;
            subtitle: string;
            buttonText: string;
        };

        // Features Section
        features: {
            title: string;
            description: string;
            icon: string;  // lucide icon name
        }[];

        // About Section
        about: {
            title: string;
            description: string;
            mission?: string;
            vision?: string;
            yearsExperience?: number;
        };

        // Featured Products Section
        products: {
            title: string;
            subtitle?: string;
            count: number;
        };

        // Brands Section
        brands: {
            title: string;
            subtitle?: string;
        };

        // FAQ Section
        faq: {
            title: string;
            subtitle?: string;
        };

        // CTA Section
        cta: {
            title: string;
            subtitle: string;
            buttonText: string;
        };

        // Footer
        footer: {
            description?: string;
            copyright: string;
        };

        // Contact Info
        contact: {
            email?: string;
            phone?: string;
            address?: string;
        };

        // Social Media & Schedule
        social?: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            tiktok?: string;
            youtube?: string;
            schedule?: {
                monday?: string;
                tuesday?: string;
                wednesday?: string;
                thursday?: string;
                friday?: string;
                saturday?: string;
                sunday?: string;
            };
        };
    };
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}

export interface FAQ {
    $id: string;
    businessId: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}

export interface Brand {
    $id: string;
    businessId: string;
    name: string;
    logo: string;  // URL
    url?: string;
    order: number;
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}
