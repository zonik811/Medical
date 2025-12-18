import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Settings, Palette, Tag, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminNav() {
    const pathname = usePathname();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Productos', href: '/dashboard/products' },
        { icon: Tag, label: 'Descuentos', href: '/dashboard/discounts' },
        { icon: Award, label: 'Marcas', href: '/dashboard/brands' },
        { icon: Palette, label: 'Editor Visual', href: '/dashboard/theme-editor' },
        { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
    ];

    return (
        <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn("w-full justify-start gap-2", isActive ? "" : "text-slate-500")}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Button>
                    </Link>
                );
            })}
        </nav>
    );
}
