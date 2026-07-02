import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Sparkles, Shield, Clock } from 'lucide-react';
import axios from 'axios';

interface LandingProps {
  setActivePage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryName?: (cat: string) => void;
  setSelectedBrandName?: (brand: string) => void;
}

export default function Landing({ setActivePage, setSelectedProductId, setSelectedCategoryName, setSelectedBrandName }: LandingProps) {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch trending products
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/api/products');
        setTrending(res.data.slice(0, 4));
      } catch (err) {
        // Fallback mock items
        setTrending([
          {
            _id: "1",
            name: "Classic Cashmere Trench Coat",
            price: 249,
            discount: 10,
            brand: "Zara",
            category: "Women",
            rating: 4.8,
            images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"]
          },
          {
            _id: "2",
            name: "ActiveFit Breathable Knit Sneakers",
            price: 135,
            discount: 0,
            brand: "Nike",
            category: "Footwear",
            rating: 5,
            images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="space-y-24 pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image Parallax */}
        <div className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-1000" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80')`
        }} />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-matteBlack via-black/35 to-black/40" />

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center text-white space-y-8 select-none">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] uppercase tracking-[0.4em] font-semibold text-luxury-gold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4.5 h-4.5" /> Luxury Autonomy & Style
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Discover the Latest <br />
            <span className="italic font-light text-luxury-gold">Fashion Trends</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm tracking-wide text-neutral-300 max-w-xl mx-auto font-light leading-relaxed"
          >
            Clean silhouettes, lightweight fabrics, and elegant textures designed to elevate your everyday wear.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => {
                if (setSelectedCategoryName) {
                  setSelectedCategoryName('Men');
                }
                setActivePage('catalog');
              }}
              className="btn-luxury"
            >
              Shop Men
            </button>
            <button 
              onClick={() => {
                if (setSelectedCategoryName) {
                  setSelectedCategoryName('Women');
                }
                setActivePage('catalog');
              }}
              className="px-8 py-3.5 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-semibold"
            >
              Shop Women
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories Carousel Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Curated Selection</span>
            <h2 className="font-serif text-3xl font-bold text-luxury-charcoal dark:text-white">Shop by Category</h2>
          </div>
          <button 
            onClick={() => setActivePage('catalog')}
            className="text-xs uppercase tracking-widest font-semibold text-neutral-600 dark:text-neutral-300 hover:text-luxury-gold flex items-center gap-1.5 transition-colors"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Women Couture', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', desc: 'Flowy Silk Dresses & Coats', category: 'Women' },
            { name: 'Men Streetwear', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', desc: 'Heavyweight Hoodies & Jackets', category: 'Men' },
            { name: 'Premium Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', desc: 'Impact Knit Sneakers', category: 'Footwear' },
            { name: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', desc: 'Luxury Bags & Timepieces', category: 'Accessories' }
          ].map((cat, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (setSelectedCategoryName) {
                  setSelectedCategoryName(cat.category);
                }
                setActivePage('catalog');
              }}
              className="group cursor-pointer overflow-hidden relative aspect-[3/4] bg-neutral-900"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mb-1">{cat.desc}</span>
                <h3 className="font-serif text-lg text-white font-semibold leading-tight group-hover:translate-x-1 transition-transform">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Showcase Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-2 pb-2">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Curated Partners</span>
          <h2 className="font-serif text-2xl font-bold uppercase tracking-wider">Shop by Brand</h2>
          <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto mt-1" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Zara', icon: '✨', tagline: 'Premium Tailoring' },
            { name: 'H&M', icon: '🌿', tagline: 'Modern Essentials' },
            { name: 'Nike', icon: '⚡', tagline: 'Athletics & Tech' },
            { name: 'Adidas', icon: '🏆', tagline: 'Active Lifestyle' },
            { name: 'Gucci', icon: '👜', tagline: 'Luxury Couture' },
            { name: 'Rolex', icon: '👑', tagline: 'Fine Timepieces' },
            { name: 'Ray-Ban', icon: '🕶️', tagline: 'Classic Eyewear' }
          ].map((brand) => (
            <button
              key={brand.name}
              onClick={() => {
                if (setSelectedBrandName) {
                  setSelectedBrandName(brand.name);
                }
                setActivePage('catalog');
              }}
              className="p-5 border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 hover:border-luxury-gold dark:hover:border-luxury-gold transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-sm"
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300">{brand.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 group-hover:text-luxury-gold transition-colors">{brand.name}</span>
              <span className="text-[9px] text-neutral-400 font-light mt-1 uppercase tracking-wide truncate max-w-full">{brand.tagline}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner (Glassmorphism & Timer) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden bg-luxury-charcoal text-white rounded-2xl shadow-xl flex flex-col lg:flex-row items-center">
          {/* Cover image */}
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80')`
          }} />
          
          <div className="relative p-8 md:p-12 lg:w-3/5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Clock className="w-3.5 h-3.5" /> FLASH DEALS FOR TODAY ONLY
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Premium Styling Drop: <br />
              <span className="text-luxury-gold">Flat 20% OFF</span>
            </h2>
            <p className="text-xs text-neutral-400 font-light max-w-md leading-relaxed">
              Use code <strong className="text-white bg-neutral-900 border border-neutral-800 px-2 py-0.5 ml-1">EZNEW20</strong> at cart checkout. Available on all cashmeres, trench coats, knitwear, and sneakers.
            </p>
            
            {/* Live Timer Countdown */}
            <div className="flex gap-4 pt-2">
              {[
                { label: 'Hrs', val: countdown.hours },
                { label: 'Mins', val: countdown.minutes },
                { label: 'Secs', val: countdown.seconds }
              ].map((time, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md px-4 py-2 border border-white/15 text-center min-w-16">
                  <div className="text-xl md:text-2xl font-bold text-luxury-gold font-mono">
                    {String(time.val).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">{time.label}</div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActivePage('catalog')}
              className="btn-luxury mt-4"
            >
              Shop The Sale
            </button>
          </div>
          
          <div className="hidden lg:block w-2/5 aspect-[4/3] bg-cover bg-center self-stretch" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80')`
          }} />
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Top Recommendations</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-charcoal dark:text-white">Trending Arrivals</h2>
          <div className="w-16 h-[2px] bg-luxury-gold mx-auto mt-2" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="bg-neutral-200 dark:bg-neutral-900 aspect-[3/4] w-full" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-900 w-2/3" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-900 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(product => (
              <div 
                key={product._id}
                onClick={() => {
                  setSelectedProductId(product._id);
                  setActivePage('product-details');
                }}
                className="group cursor-pointer space-y-4"
              >
                {/* Image Container with Zoom */}
                <div className="overflow-hidden relative aspect-[3/4] bg-neutral-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover-scale-luxury" 
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-charcoal text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      -{product.discount}%
                    </span>
                  )}
                  {/* Quick Add icon overlay */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-luxury-charcoal p-2 rounded-full shadow-md hover:bg-luxury-gold hover:text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>

                {/* Meta details */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{product.brand}</span>
                    <div className="flex items-center gap-0.5 text-luxury-gold text-[10px]">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 truncate group-hover:text-luxury-gold transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-luxury-gold">${product.price * (1 - product.discount / 100)}</span>
                    {product.discount > 0 && (
                      <span className="text-[10px] line-through text-neutral-400 font-light">${product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Brand values / Perks (Nike/Apple-inspired styling) */}
      <section className="bg-neutral-50 dark:bg-neutral-900/20 border-y border-neutral-100 dark:border-neutral-900 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'LUXURY TAILORING', desc: 'Every piece is crafted from premium textiles like cashmere, heavy fleece, and genuine leather.', icon: Sparkles },
            { title: 'SECURE CHECKOUT', desc: 'UPI, credit cards, Stripe, or Cash on Delivery. Every transaction is encrypted.', icon: Shield },
            { title: 'EXPRESS SHIPPING', desc: 'Free standard shipping on orders over $200. Dispatch within 24 hours.', icon: Clock }
          ].map((perk, i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 h-fit rounded-lg shadow-sm text-luxury-gold">
                <perk.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">{perk.title}</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
