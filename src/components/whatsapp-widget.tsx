"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Clock, CheckCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { useBusinessStore } from "@/lib/store/business-store";

interface QuickAction {
    icon: string;
    text: string;
    message: string;
}

interface WhatsAppWidgetProps {
    phoneNumber?: string;
    welcomeMessage?: string;
    businessName?: string;
    avatar?: string;
    quickActions?: QuickAction[];
    position?: "bottom-right" | "bottom-left";
    showBadge?: boolean;
    workingHours?: {
        start: string;
        end: string;
        timezone?: string;
    };
}

export function WhatsAppWidget({
    phoneNumber = "573000000000",
    welcomeMessage = "Hola! Quiero hacer un pedido.",
    businessName = "Soporte",
    avatar,
    quickActions,
    position = "bottom-right",
    showBadge = true,
    workingHours,
}: WhatsAppWidgetProps) {
    const { business } = useBusinessStore();

    // Usar datos del store si existen, sino usar props/defaults
    const finalPhoneNumber = business?.whatsapp || phoneNumber;
    const finalBusinessName = business?.name || businessName;
    const finalAvatar = business?.logoUrl || avatar; // Asumiendo que logoUrl es el avatar

    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showTyping, setShowTyping] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);

    const defaultQuickActions: QuickAction[] = quickActions || [
        { icon: "📦", text: "Consultar estado de pedido", message: "Hola, quisiera consultar el estado de mi pedido" },
        { icon: "🕒", text: "Horarios de atención", message: "¿Cuáles son los horarios de atención?" },
        { icon: "📍", text: "Ubicación del local", message: "¿Dónde están ubicados?" },
        { icon: "🛍️", text: "Hacer un nuevo pedido", message: "Hola! Quiero hacer un pedido" },
    ];

    useEffect(() => {
        // Simular efecto de "typing" al abrir
        if (isOpen) {
            setShowTyping(true);
            const timer = setTimeout(() => setShowTyping(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Verificar horario de atención
    useEffect(() => {
        if (workingHours) {
            const checkWorkingHours = () => {
                const now = new Date();
                const currentHour = now.getHours();
                const [startHour] = workingHours.start.split(":").map(Number);
                const [endHour] = workingHours.end.split(":").map(Number);
                setIsOnline(currentHour >= startHour && currentHour < endHour);
            };
            checkWorkingHours();
            const interval = setInterval(checkWorkingHours, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [workingHours]);

    // Simular badge de nuevo mensaje
    useEffect(() => {
        if (!isOpen && showBadge) {
            const timer = setTimeout(() => setHasNewMessage(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, showBadge]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasNewMessage(false);
        }
    };

    const handleWhatsAppRedirect = (message?: string) => {
        const finalMessage = message || welcomeMessage;
        const url = `https://wa.me/${finalPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    const positionClasses = {
        "bottom-right": "bottom-4 right-4 items-end",
        "bottom-left": "bottom-4 left-4 items-start",
    };

    return (
        <div className={cn("fixed z-50 flex flex-col gap-4", positionClasses[position])}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-5 text-white relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                                            {finalAvatar ? (
                                                <Image src={finalAvatar} alt={finalBusinessName} width={48} height={48} className="object-cover" />
                                            ) : (
                                                <MessageCircle size={24} className="text-[#25D366]" />
                                            )}
                                        </div>
                                        {/* Status indicator */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={cn(
                                                "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
                                                isOnline ? "bg-green-400" : "bg-slate-400"
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{finalBusinessName}</h3>
                                        <p className="text-xs opacity-90 flex items-center gap-1.5">
                                            {isOnline ? (
                                                <>
                                                    <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                                    En línea
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} />
                                                    Fuera de horario
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleOpen}
                                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="p-5 bg-[#E5DDD5] dark:bg-slate-950 min-h-[320px] max-h-[400px] overflow-y-auto flex flex-col gap-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48cGF0aCBkPSJNMjUgMjVtLTE1IDBhMTUgMTUgMCAxIDAgMzAgMGExNSAxNSAwIDEgMC0zMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjcGF0dGVybikiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] bg-repeat">
                            {/* Welcome Message */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl rounded-tl-none shadow-md max-w-[85%] relative"
                            >
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                    ¡Hola! 👋 Bienvenido a {finalBusinessName}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                                    ¿En qué podemos ayudarte hoy?
                                </p>
                                <div className="absolute -bottom-2 left-0 w-0 h-0 border-t-[8px] border-t-white dark:border-t-slate-800 border-r-[8px] border-r-transparent" />
                            </motion.div>

                            {/* Typing Indicator */}
                            <AnimatePresence>
                                {showTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none shadow-sm w-16 flex items-center justify-center gap-1"
                                    >
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-2 mt-auto pt-2">
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium px-1">
                                    Respuestas rápidas:
                                </p>
                                {defaultQuickActions.map((action, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleWhatsAppRedirect(action.message)}
                                        className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl hover:border-[#25D366] hover:bg-[#25D366]/5 dark:hover:bg-[#25D366]/10 text-left transition-all shadow-sm group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-lg">{action.icon}</span>
                                            <span className="text-slate-700 dark:text-slate-300 group-hover:text-[#25D366] transition-colors">
                                                {action.text}
                                            </span>
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Button
                                onClick={() => handleWhatsAppRedirect()}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-3 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center group"
                            >
                                <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
                                <span>Continuar en WhatsApp</span>
                                <Send size={20} className="opacity-80" />
                            </Button>

                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                                Respuesta típica: <span className="font-medium">en minutos</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.div className="relative">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={toggleOpen}
                        size="icon"
                        className={cn(
                            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 relative overflow-hidden group",
                            isOpen
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-[#25D366] hover:bg-[#128C7E]"
                        )}
                    >
                        {/* Pulse effect cuando está cerrado */}
                        {!isOpen && (
                            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
                        )}

                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={28} className="text-white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MessageCircle size={28} className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>

                {/* Badge de notificación */}
                <AnimatePresence>
                    {hasNewMessage && !isOpen && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 shadow-lg"
                        >
                            1
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status indicator en el botón */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                            "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950",
                            isOnline ? "bg-green-400" : "bg-slate-400"
                        )}
                    />
                )}
            </motion.div>
        </div>
    );
}
