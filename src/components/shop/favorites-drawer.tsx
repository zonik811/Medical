"use client";

import { useFavoritesStore } from "@/lib/store/favorites-store";
import { Button } from "@/components/ui/button";
import { X, Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { create } from "zustand";

// UI Store para abrir/cerrar el drawer de favoritos
interface FavoritesUIState {
    isOpen: boolean;
    toggleFavorites: () => void;
}

export const useFavoritesUI = create<FavoritesUIState>((set) => ({
    isOpen: false,
    toggleFavorites: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export function FavoritesDrawer() {
    const { favorites, removeFavorite } = useFavoritesStore();
    const { isOpen, toggleFavorites } = useFavoritesUI();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleFavorites}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        transition={{ duration: 0.2 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 z-50 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="relative p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0.8 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-red-500/10 p-2.5 rounded-xl"
                                >
                                    <Heart size={24} className="text-red-500 fill-current" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Me Gusta</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} guardados
                                    </p>
                                </div>
                            </div>

                            <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleFavorites}
                                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X size={24} />
                                </Button>
                            </motion.div>
                        </div>

                        {/* Lista de productos */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            <AnimatePresence mode="popLayout">
                                {favorites.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="h-full flex flex-col items-center justify-center text-center px-8"
                                    >
                                        <motion.div
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-950/20 p-8 rounded-3xl mb-6"
                                        >
                                            <Heart size={64} className="text-red-300 dark:text-red-700 mx-auto" strokeWidth={1.5} />
                                        </motion.div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            Sin favoritos aún
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                            Guarda los productos que más te gusten para verlos aquí.
                                        </p>
                                        <Button
                                            onClick={toggleFavorites}
                                            className="rounded-full px-6"
                                        >
                                            Explorar Menú
                                        </Button>
                                    </motion.div>
                                ) : (
                                    favorites.map((product, index) => (
                                        <motion.div
                                            key={product.$id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex gap-4 hover:shadow-lg transition-all"
                                        >
                                            {/* Imagen */}
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                                {product.imageUrl && (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-black text-primary">
                                                        ${product.price.toLocaleString()}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => removeFavorite(product.$id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                        <Link href={`/product/${product.$id}`} onClick={toggleFavorites}>
                                                            <Button size="sm" className="h-8 text-xs rounded-lg">
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
