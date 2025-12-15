"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    gradient?: boolean;
    elevated?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, gradient = false, elevated = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-2xl border bg-white dark:bg-slate-900 text-card-foreground transition-all duration-300",
                // Sombras mejoradas según elevación
                elevated ? "shadow-xl hover:shadow-2xl" : "shadow-sm hover:shadow-md",
                // Animación hover con CSS puro - MISMO EFECTO VISUAL
                hover && "hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500",
                // Borde gradiente sutil
                gradient && "border-transparent bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-2 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    gradient?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, gradient = false, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                "text-2xl font-bold leading-tight tracking-tight",
                gradient
                    ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent"
                    : "text-foreground",
                className
            )}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(
            "text-sm text-slate-600 dark:text-slate-400 leading-relaxed",
            className
        )}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    padded?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, padded = true, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(padded && "p-6 pt-0", className)}
            {...props}
        />
    )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    separated?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, separated = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex items-center p-6 pt-0",
                separated && "border-t border-slate-200 dark:border-slate-800 pt-4 mt-4",
                className
            )}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

const CardBadge = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "error" }
>(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-primary/10 text-primary",
        success: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
        warning: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
        error: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    };

    return (
        <span
            ref={ref}
            className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
CardBadge.displayName = "CardBadge";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    CardBadge
};
