"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    optional?: boolean;
    error?: boolean;
    disabled?: boolean;
    tooltip?: string;
    variant?: "default" | "inline" | "floating";
    size?: "sm" | "default" | "lg";
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    (
        {
            className,
            children,
            required = false,
            optional = false,
            error = false,
            disabled = false,
            tooltip,
            variant = "default",
            size = "default",
            ...props
        },
        ref
    ) => {
        const [showTooltip, setShowTooltip] = React.useState(false);

        const variants = {
            default: "block mb-2",
            inline: "inline-flex items-center mr-4",
            floating: "absolute left-3 top-2 transition-all pointer-events-none",
        };

        const sizes = {
            sm: "text-xs",
            default: "text-sm",
            lg: "text-base",
        };

        return (
            <div className="relative inline-flex items-center gap-2">
                <label
                    ref={ref}
                    className={cn(
                        "font-medium leading-none transition-colors duration-200",
                        variants[variant],
                        sizes[size],
                        // Colores según estado
                        error
                            ? "text-red-600 dark:text-red-400"
                            : disabled
                                ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                : "text-slate-700 dark:text-slate-300",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        className
                    )}
                    {...props}
                >
                    {children}

                    {/* Indicador de requerido */}
                    {required && (
                        <span
                            className="text-red-500 dark:text-red-400 ml-1 font-bold"
                            aria-label="required"
                        >
                            *
                        </span>
                    )}

                    {/* Indicador de opcional */}
                    {optional && !required && (
                        <span className="text-slate-400 dark:text-slate-500 ml-1.5 font-normal text-xs">
                            (opcional)
                        </span>
                    )}
                </label>

                {/* Tooltip de ayuda */}
                {tooltip && (
                    <div className="relative inline-flex">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onFocus={() => setShowTooltip(true)}
                            onBlur={() => setShowTooltip(false)}
                            aria-label="Help"
                        >
                            <HelpCircle size={14} />
                        </button>

                        {/* Tooltip popup */}
                        {showTooltip && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 animate-in fade-in slide-in-from-bottom-1 duration-200">
                                <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs whitespace-normal">
                                    {tooltip}
                                    {/* Flecha del tooltip */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Label.displayName = "Label";

export { Label };
