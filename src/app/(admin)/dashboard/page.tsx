"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import { ordersApi } from "@/services/orders.api";
import { useBusinessStore } from "@/lib/store/business-store";
import { OrderStats } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { business } = useBusinessStore();
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, [business]);

    const loadStats = async () => {
        if (!business) {
            setError("No se pudo cargar el negocio");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await ordersApi.getStats(business.$id);
            setStats(data);
            setError(null);
        } catch (err: any) {
            console.error("Error loading stats:", err);
            setError(err.message || "Error al cargar estadísticas");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Resumen general de tu negocio.</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay datos disponibles</p>
                            <p className="text-sm mt-2">Las órdenes confirmadas aparecerán aquí</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Ventas Totales',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: `${stats.totalOrders} órdenes totales`,
        },
        {
            label: 'Ventas Hoy',
            value: `$${stats.todayRevenue.toLocaleString()}`,
            icon: TrendingUp,
            description: `${stats.todayOrders} órdenes hoy`,
        },
        {
            label: 'Órdenes Totales',
            value: stats.totalOrders.toString(),
            icon: ShoppingBag,
            description: 'Desde el inicio',
        },
        {
            label: 'Promedio por Orden',
            value: stats.totalOrders > 0 ? `$${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()}` : '$0',
            icon: Package,
            description: 'Ticket promedio',
        },
    ];

=======
import { Construction, Wrench, Hammer } from "lucide-react";

export default function DashboardPage() {
>>>>>>> e7e7940e4a738fff4e3578a883c53dba98123641
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Resumen general de tu negocio.</p>
                </div>
                <button
                    onClick={loadStats}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    🔄 Actualizar
                </button>
            </div>

<<<<<<< HEAD
            {/* Tarjetas de métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Sección de Productos Más Vendidos */}
            <Card>
                <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.topProducts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay productos vendidos aún</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.topProducts.map((product, index) => (
                                <div key={product.productId} className="flex items-center gap-4">
                                    {/* Ranking badge */}
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                                        ${index === 1 ? 'bg-gray-100 text-gray-700' : ''}
                                        ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                                        ${index > 2 ? 'bg-slate-100 text-slate-600' : ''}
                                    `}>
                                        {index + 1}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {product.productName}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {product.totalQuantity} {product.totalQuantity === 1 ? 'unidad' : 'unidades'} vendidas
                                        </p>
                                    </div>

                                    {/* Revenue */}
                                    <div className="text-right">
                                        <div className="font-medium">
                                            ${product.totalRevenue.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            ${Math.round(product.totalRevenue / product.totalQuantity).toLocaleString()} c/u
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info card */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">Datos en tiempo real</h3>
                            <p className="text-sm text-muted-foreground">
                                Estas estadísticas se actualizan automáticamente con cada nueva orden.
                                Los productos más vendidos se actualizan según el total de unidades vendidas.
=======
            <Card className="border-dashed border-2">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-6 py-12">
                        <div className="flex items-center gap-3">
                            <Construction className="h-16 w-16 text-orange-500 animate-pulse" />
                            <Hammer className="h-12 w-12 text-orange-400" />
                            <Wrench className="h-10 w-10 text-orange-600" />
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">
                                🚧 Dashboard en Construcción
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Estamos trabajando en traerte las mejores estadísticas y métricas para tu negocio.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" />
                            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                                Próximamente disponible
>>>>>>> e7e7940e4a738fff4e3578a883c53dba98123641
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
<<<<<<< HEAD
=======

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            📊 Métricas de Ventas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>

                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            📈 Análisis de Rendimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>

                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            🎯 Productos Populares
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>
            </div>
>>>>>>> e7e7940e4a738fff4e3578a883c53dba98123641
        </div>
    );
}
