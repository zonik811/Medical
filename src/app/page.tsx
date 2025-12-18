"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Product, LandingConfig, FAQ, Brand } from "@/types";
import {
  ArrowRight,
  Truck,
  Star,
  MessageCircle,
  DollarSign,
  ChevronDown,
  ChevronRight,
  MapPin,
  Send,
  Loader2
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { ProductCard } from "@/components/shop/product-card";
import { useCartStore } from "@/lib/store/cart-store";

const DEFAULT_CONFIG: LandingConfig['config'] = {
  hero: {
    title: "Bienvenido a Nuestro Catálogo",
    subtitle: "Descubre productos increíbles con la mejor calidad y servicio",
    buttonText: "Ver Catálogo Completo"
  },
  features: [
    { title: "Envío Rápido", description: "Entrega en 24-48 hrs", icon: "Truck" },
    { title: "Calidad Premium", description: "Productos garantizados", icon: "Star" },
    { title: "Soporte 24/7", description: "Siempre disponibles", icon: "MessageCircle" },
    { title: "Mejores Precios", description: "Ofertas increíbles", icon: "DollarSign" }
  ],
  about: {
    title: "Quiénes Somos",
    description: "Somos una empresa comprometida con ofrecer los mejores productos y servicios a nuestros clientes.",
    mission: "Nuestra misión es transformar la experiencia de compra.",
    vision: "Ser líderes en el mercado digital."
  },
  products: {
    title: "Productos Destacados",
    subtitle: "Lo mejor de nuestro catálogo",
    count: 6
  },
  brands: {
    title: "Marcas que Confían en Nosotros",
    subtitle: ""
  },
  faq: {
    title: "Preguntas Frecuentes",
    subtitle: "Resolvemos tus dudas"
  },
  cta: {
    title: "¿Listo para explorar?",
    subtitle: "Descubre todos nuestros productos y encuentra lo que buscas",
    buttonText: "Explorar Catálogo Completo"
  },
  footer: {
    description: "Tu tienda online de confianza",
    copyright: "© 2025 Catálogo Digital. Todos los derechos reservados."
  },
  contact: {
    email: "",
    phone: "",
    address: ""
  }
};

interface Category {
  $id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function LandingPage() {
  const [config, setConfig] = useState<LandingConfig['config']>(DEFAULT_CONFIG);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [businessId] = useState(process.env.NEXT_PUBLIC_BUSINESS_ID || "");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const { addItem } = useCartStore();
  const { scrollY } = useScroll();

  // Parallax effect for hero
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    loadLandingData();
  }, []);

  const loadLandingData = async () => {
    try {
      setIsLoading(true);

      const landingConfig = await api.landingConfig.get(businessId);
      if (landingConfig) {
        setConfig(landingConfig.config);
      }

      const productsResponse = await api.products.list(businessId);
      const allProducts = productsResponse.documents;
      const count = landingConfig?.config.products.count || 6;
      setFeaturedProducts(allProducts.slice(0, count));

      const categoriesResponse = await api.categories.list(businessId);
      const allCategories = categoriesResponse.documents || [];
      const firstCategories = allCategories.slice(0, 4);
      setCategories(firstCategories as any);

      const prodsByCat: Record<string, Product[]> = {};
      firstCategories.forEach((cat: any) => {
        const categoryProducts = allProducts.filter(
          (prod: Product) => prod.categoryId === cat.$id
        );
        prodsByCat[cat.$id] = categoryProducts.slice(0, 4);
      });
      setProductsByCategory(prodsByCat);

      const faqsList = await api.faq.list(businessId);
      setFaqs(faqsList);

      const brandsList = await api.brands.list(businessId);
      setBrands(brandsList);
    } catch (error) {
      console.error("Error loading landing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: any = { Truck, Star, MessageCircle, DollarSign };
    return icons[iconName] || Star;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero Section con Parallax */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </motion.div>

        {/* Floating shapes animation */}
        <div className="absolute inset-0 overflow-hidden z-[5]">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 text-center text-white"
          style={{ opacity: heroOpacity }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {config.hero.title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {config.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg hover:shadow-xl transition-all"
              >
                {config.hero.buttonText}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Fondo con imagen sutil */}
      <section className="relative py-20 overflow-hidden" id="features">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-secondary/5">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "url('/bg2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ¿Por Qué Elegirnos?
            </motion.h2>
            <p className="text-muted-foreground text-primary">
              Comprometidos con la excelencia en cada detalle
            </p>
          </div>
          <div className="text-primary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.features.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <motion.div
                  key={index}
                  className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border hover:border-primary/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section - Con imagen de fondo y overlay */}
      <section id="about" className="text-primary relative py-20 px-4 overflow-hidden">
        {/* Background image with parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('/bg3.png')",
          }}
        />
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">{config.about.title}</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              {config.about.description}
            </p>
            <div className="text-primarygrid md:grid-cols-2 gap-6 mt-8">
              {config.about.mission && (
                <motion.div
                  className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-semibold text-primary mb-2 text-lg">Misión</h3>
                  <p className=" text-primary text-foreground">{config.about.mission}</p>
                </motion.div>
              )}
              {config.about.vision && (
                <motion.div
                  className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-semibold text-primary mb-2 text-lg">Visión</h3>
                  <p className="text-primary text-foreground">{config.about.vision}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Catalog Section - Fondo limpio con patrón sutil */}
      <section className="relative py-20 bg-secondary/5" id="catalog">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Explora Nuestras Categorías
            </motion.h2>
            <p className="text-muted-foreground text-primary">
              Encuentra lo que necesitas organizado por categorías
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-16">
              {categories.map((category, catIndex) => (
                <motion.div
                  key={category.$id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-primary">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground max-w-md">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productsByCategory[category.$id]?.map((product) => (
                      <ProductCard
                        key={product.$id}
                        product={product}
                        onAddToCart={() => addItem(product)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay productos disponibles en este momento
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all">
                Ver Todo el Catálogo
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section - Con imagen de fondo */}
      {brands.length > 0 && (
        <section id="brands" className="text-primary relative py-16 px-4 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
            style={{
              backgroundImage: "url('/bg2.png')",
            }}
          />
          <div className="absolute inset-0 bg-background/90" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {config.brands.title}
              </motion.h2>
              {config.brands.subtitle && (
                <p className="text-muted-foreground">{config.brands.subtitle}</p>
              )}
            </div>

            {/* Animated Marquee */}
            <div className="relative">
              <div className="flex gap-12 animate-marquee">
                {brands.map((brand) => (
                  <div
                    key={brand.$id}
                    className="flex-shrink-0 flex items-center justify-center p-6 rounded-lg transition-all hover:scale-110 bg-card/50 backdrop-blur-sm border"
                  >
                    {brand.url ? (
                      <a href={brand.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                      />
                    )}
                  </div>
                ))}
                {brands.map((brand) => (
                  <div
                    key={`${brand.$id}-duplicate`}
                    className="flex-shrink-0 flex items-center justify-center p-6 rounded-lg transition-all hover:scale-110 bg-card/50 backdrop-blur-sm border"
                  >
                    {brand.url ? (
                      <a href={brand.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* FAQ Section - Con gradiente animado */}
      {faqs.length > 0 && (
        <section id="faq" className="relative py-20 px-4 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2
                className="text-primary text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {config.faq.title}
              </motion.h2>
              {config.faq.subtitle && (
                <p className=" text-primary text-lg text-muted-foreground">{config.faq.subtitle}</p>
              )}
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.$id}
                  className="rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm border"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.$id ? null : faq.$id)}
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === faq.$id ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openFaq === faq.$id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t"
                    >
                      <div className="p-4">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Con imagen de fondo dramática */}
      <section className="relative py-32 px-4 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/bg3.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {config.cta.title}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {config.cta.subtitle}
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="text-lg px-12 h-16 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all"
              >
                {config.cta.buttonText}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        {/* Mini features */}
        <div className="text-primary border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-primary font-semibold">Envíos a Nivel Nacional</p>
                  <p className="text-primary text-sm text-muted-foreground">
                    Despachamos a toda Colombia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-primary font-semibold">Ubicación en Bogotá</p>
                  <p className="text-primary text-sm text-muted-foreground">
                    Distribución desde Bogotá
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-primary font-semibold">Compra Segura en Línea</p>
                  <p className="text-primary text-sm text-muted-foreground">
                    Transacciones protegidas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-primary font-semibold">Asesoría y Cumplimiento</p>
                  <p className="text-primary text-sm text-muted-foreground">
                    Calidad y soporte garantizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">
                Nosotros
              </h3>
              <p className="text-primary text-sm text-muted-foreground mb-4">
                {config.footer.description}
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-primary text-lg font-bold">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <span className="text-primary text-lg font-bold">in</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <span className="text-primary text-lg font-bold">W</span>
                </a>
              </div>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">
                Menú
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-primary text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-primary text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="text-primary text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className=" text-primary text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">
                Categorías
              </h3>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.$id}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="text-primary text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">
                Suscríbete
              </h3>
              <p className="text-primary text-sm text-muted-foreground mb-4">
                Déjanos tu correo y recibe información valiosa junto con las ofertas que tenemos
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="text-primary flex-1 px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send size={18} />
                  </Button>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id=" newsletter-accept"
                    className=" mt-1 rounded"
                    required
                  />
                  <label
                    htmlFor="newsletter-accept"
                    className="text-primary text-xs text-muted-foreground"
                  >
                    Acepto recibir correos con ofertas y novedades
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-primary border-t">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <p className="text-primary text-center text-sm text-muted-foreground">
              {config.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
