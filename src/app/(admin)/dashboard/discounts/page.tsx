"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Placeholder component to debug build issues
function DiscountsContent() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Sección en mantenimiento</h2>
                <p className="text-muted-foreground">Estamos resolviendo unos problemas técnicos con esta página.</p>
            </div>
        </div>
    );
}

export default function DiscountsPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <DiscountsContent />
        </Suspense>
    );
}
