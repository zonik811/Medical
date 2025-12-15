import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Eye, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: 'Ventas del Mes', value: '$1,250,000', icon: DollarSign, trend: '+12%' },
        { label: 'Pedidos Totales', value: '48', icon: ShoppingBag, trend: '+5%' },
        { label: 'Visitas a la Tienda', value: '1,203', icon: Eye, trend: '+18%' },
        { label: 'Tasa de Conversión', value: '3.2%', icon: TrendingUp, trend: '-1%' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Resumen general de tu negocio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
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
                                <p className="text-xs text-muted-foreground">
                                    <span className={stat.trend.startsWith('+') ? "text-green-500" : "text-red-500"}>
                                        {stat.trend}
                                    </span>{" "}
                                    respecto al mes pasado
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Gráfico de Ventas (Placeholder)
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Productos Populares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* List of mock popular products */}
                        <div className="space-y-4">
                            {['Hamburguesa Clásica', 'Malteada', 'Papas Fritas'].map((item, i) => (
                                <div key={item} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item}</p>
                                        <p className="text-sm text-muted-foreground">{120 - i * 20} ventas</p>
                                    </div>
                                    <div className="ml-auto font-medium">+${(15000 * (12 - i)).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
