"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X, AlertCircle, CheckCircle2 } from "lucide-react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: "default" | "filled" | "ghost";
    inputSize?: "sm" | "default" | "lg";
    clearable?: boolean;
    onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            variant = "default",
            inputSize = "default",
            clearable = false,
            onClear,
            disabled,
            value,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);
        const inputId = id || `input-${React.useId()}`;
        const hasValue = value !== undefined && value !== "";

        const handleClear = () => {
            onClear?.();
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const variants = {
            default: "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950",
            filled: "border-transparent bg-slate-100 dark:bg-slate-900",
            ghost: "border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            default: "h-11 px-4 text-sm",
            lg: "h-13 px-5 text-base",
        };

        const inputType = type === "password" && showPassword ? "text" : type;

        return (
            <div className="w-full space-y-2">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "block text-sm font-medium transition-colors duration-200",
                            error
                                ? "text-red-600 dark:text-red-400"
                                : isFocused
                                    ? "text-primary"
                                    : "text-slate-700 dark:text-slate-300"
                        )}
                    >
                        {label}
                        {props.required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        value={value}
                        disabled={disabled}
                        className={cn(
                            "flex w-full rounded-xl border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50",
                            variants[variant],
                            sizes[inputSize],
                            // Colores según estado
                            error
                                ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500/20 bg-red-50 dark:bg-red-950/10"
                                : "focus-visible:ring-primary/20 focus-visible:border-primary",
                            // Padding con iconos
                            leftIcon && "pl-10",
                            (rightIcon || clearable || type === "password") &&
                            "pr-10",
                            className
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />

                    {/* Right Side Icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {/* Clear Button */}
                        {clearable && hasValue && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                tabIndex={-1}
                            >
                                <X size={16} />
                            </button>
                        )}

                        {/* Password Toggle */}
                        {type === "password" && (
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        )}

                        {/* Custom Right Icon */}
                        {rightIcon && !clearable && type !== "password" && (
                            <div className="text-slate-500 dark:text-slate-400">
                                {rightIcon}
                            </div>
                        )}

                        {/* Error Icon */}
                        {error && (
                            <AlertCircle
                                size={18}
                                className="text-red-500"
                            />
                        )}
                    </div>
                </div>

                {/* Helper Text or Error Message */}
                {(helperText || error) && (
                    <div
                        className={cn(
                            "flex items-start gap-1.5 text-xs transition-all duration-200",
                            error
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-500 dark:text-slate-400"
                        )}
                    >
                        {error ? (
                            <>
                                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </>
                        ) : (
                            <span>{helperText}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
