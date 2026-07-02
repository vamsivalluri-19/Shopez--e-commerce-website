import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Star, Grid, Sparkles, Filter, X } from 'lucide-react';
import axios from 'axios';

interface CatalogProps {
  setActivePage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
  initialCategory?: string;
  setInitialCategory?: (cat: string) => void;
  initialBrand?: string;
  setInitialBrand?: (brand: string) => void;
}

export default function Catalog({ setActivePage, setSelectedProductId, initialCategory, setInitialCategory, initialBrand, setInitialBrand }: CatalogProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Listen to initial category navigation
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (setInitialCategory) {
        setInitialCategory('');
      }
    }
  }, [initialCategory, setInitialCategory]);

  // Listen to initial brand navigation
  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      if (setInitialBrand) {
        setInitialBrand('');
      }
    }
  }, [initialBrand, setInitialBrand]);

  // Fetch meta categories/brands
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get('/api/products/categories');
        setCategories(res.data.categories || ['Men', 'Women', 'Kids', 'Accessories', 'Footwear']);
        setBrands(res.data.brands || ['Zara', 'Nike', 'H&M', 'Gucci', 'Rolex', 'Ray-Ban']);
      } catch (err) {
        setCategories(['Men', 'Women', 'Kids', 'Accessories', 'Footwear']);
        setBrands(['Zara', 'Nike', 'H&M', 'Gucci', 'Rolex', 'Ray-Ban']);
      }
    };
    fetchMeta();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        let url = `/api/products?priceMax=${priceRange}`;
        if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedBrand) url += `&brand=${encodeURIComponent(selectedBrand)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (sortBy) url += `&sort=${encodeURIComponent(sortBy)}`;

        const res = await axios.get(url);
        
        let filteredList = res.data;
        if (selectedRating > 0) {
          filteredList = filteredList.filter((p: any) => p.rating >= selectedRating);
        }
        setProducts(filteredList);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    const delayDebounce = setTimeout(fetchFiltered, 250);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, selectedBrand, priceRange, search, sortBy, selectedRating]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange(1000);
    setSearch('');
    setSortBy('');
    setSelectedRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Shop the Collection</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1">Catalog</h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs uppercase bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-luxury-gold"
            />
          </div>
          
          {/* Sort selection */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-2 pr-8 focus:outline-none uppercase font-semibold tracking-wider text-neutral-600 dark:text-neutral-300"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Catalog View: Sidebar + Grid */}
      <div className="flex gap-10">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 dark:text-luxury-gold">
              <Filter className="w-3.5 h-3.5" /> Filter Collection
            </h2>
            {(selectedCategory || selectedBrand || priceRange < 1000 || search || sortBy) && (
              <button onClick={clearFilters} className="text-[10px] uppercase font-bold text-neutral-400 hover:text-luxury-gold">Clear</button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Category</span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`text-left text-xs uppercase tracking-wide py-1 transition-colors ${
                  selectedCategory === '' ? 'text-luxury-gold font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs uppercase tracking-wide py-1 transition-colors ${
                    selectedCategory === cat ? 'text-luxury-gold font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Brand</span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedBrand('')}
                className={`text-left text-xs uppercase tracking-wide py-1 transition-colors ${
                  selectedBrand === '' ? 'text-luxury-gold font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold'
                }`}
              >
                All Brands
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`text-left text-xs uppercase tracking-wide py-1 transition-colors ${
                    selectedBrand === brand ? 'text-luxury-gold font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Max Price</span>
              <span className="text-xs font-bold text-luxury-gold">${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-3 pt-4 border-t border-neutral-105 dark:border-neutral-900">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Minimum Rating</span>
            <div className="flex flex-col gap-2">
              {[
                { val: 0, label: 'All Ratings' },
                { val: 4, label: '4★ & Above' },
                { val: 3, label: '3★ & Above' }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setSelectedRating(item.val)}
                  className={`text-left text-xs uppercase tracking-wide py-1 transition-colors ${
                    selectedRating === item.val ? 'text-luxury-gold font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-6">
          {/* Mobile Filter toggle button */}
          <div className="md:hidden flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/30 p-4 border">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <span className="text-[10px] text-neutral-400 font-medium uppercase">{products.length} Products Found</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="space-y-4 animate-pulse">
                  <div className="bg-neutral-200 dark:bg-neutral-900 aspect-[3/4] w-full" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-900 w-2/3" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-900 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-neutral-200 dark:border-neutral-800">
              <SlidersHorizontal className="w-10 h-10 text-neutral-300 stroke-1" />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold text-neutral-700 dark:text-neutral-300">No Matching Products</p>
                <p className="text-[11px] text-neutral-400 font-light">Try expanding your price range, clearing search terms, or shifting filters.</p>
              </div>
              <button 
                onClick={clearFilters}
                className="px-6 py-2.5 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-[10px] uppercase tracking-widest font-bold hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div 
                  key={product._id}
                  onClick={() => {
                    setSelectedProductId(product._id);
                    setActivePage('product-details');
                  }}
                  className="group cursor-pointer space-y-4"
                >
                  <div className="overflow-hidden relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900/10">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover-scale-luxury" 
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-charcoal text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

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
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-start">
          <div className="w-64 bg-white dark:bg-luxury-matteBlack h-full p-6 flex flex-col justify-between border-r border-neutral-100 dark:border-neutral-900">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-widest">Filter By</span>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">Category</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border bg-transparent uppercase focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">Brand</span>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs border bg-transparent uppercase focus:outline-none"
                >
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-[9px] font-semibold text-neutral-400 uppercase">
                  <span>Price Limit</span>
                  <span className="text-luxury-gold">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-luxury-gold"
                />
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-3 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-xs uppercase tracking-widest font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
