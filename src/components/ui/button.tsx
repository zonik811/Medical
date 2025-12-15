"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            asChild = false,
            isLoading = false,
            leftIcon,
            rightIcon,
            ripple = false,
            disabled,
            children,
            onClick,
            type = "button",
            ...props
        },
        ref
    ) => {
        const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (ripple && !disabled && !isLoading) {
                const button = e.currentTarget;
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const id = Date.now();

                setRipples((prev) => [...prev, { x, y, id }]);

                setTimeout(() => {
                    setRipples((prev) => prev.filter((r) => r.id !== id));
                }, 600);
            }

            onClick?.(e);
        };

        const variantStyles = {
            default:
                "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30",
            secondary:
                "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
            outline:
                "border-2 border-input bg-background hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-foreground hover:border-primary/50",
            ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-foreground",
            destructive:
                "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg shadow-red-500/20 hover:shadow-red-500/30",
            link: "text-primary underline-offset-4 hover:underline",
        };

        const sizeStyles = {
            default: "h-10 px-4 py-2",
            sm: "h-9 px-3 text-sm",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10",
        };

        const baseClasses = cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl relative overflow-hidden",
            variantStyles[variant],
            sizeStyles[size],
            isLoading && "cursor-wait",
            className
        );

        const buttonContent = (
            <>
                {/* Ripple effect */}
                {ripple && ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        className="absolute bg-white/30 rounded-full pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 0,
                            height: 0,
                        }}
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{
                            width: 300,
                            height: 300,
                            opacity: 0,
                            x: -150,
                            y: -150,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                ))}

                {/* Loading spinner */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </motion.div>
                )}

                {/* Left icon */}
                {!isLoading && leftIcon && (
                    <span className="flex items-center">
                        {leftIcon}
                    </span>
                )}

                {/* Children content */}
                <span className={cn(isLoading && "opacity-0")}>{children}</span>

                {/* Right icon */}
                {!isLoading && rightIcon && (
                    <span className="flex items-center">
                        {rightIcon}
                    </span>
                )}
            </>
        );

        // Si usa asChild, retornar Slot sin animaciones
        if (asChild) {
            return (
                <Slot
                    className={baseClasses}
                    ref={ref}
                    onClick={handleClick}
                    {...props}
                >
                    {children}
                </Slot>
            );
        }

        // Si no usa asChild, retornar motion.button con animaciones
        return (
            <motion.button
                className={baseClasses}
                ref={ref}
                type={type}
                disabled={disabled || isLoading}
                onClick={handleClick}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                // Omitir props que causen conflictos con motion
                aria-label={props["aria-label"]}
                aria-labelledby={props["aria-labelledby"]}
                aria-describedby={props["aria-describedby"]}
                id={props.id}
                name={props.name}
                value={props.value}
                form={props.form}
                tabIndex={props.tabIndex}
            >
                {buttonContent}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
