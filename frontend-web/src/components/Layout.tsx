import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { logout, updateWishlist } from '../store/authSlice';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon, getCartTotals, toggleGiftWrap } from '../store/cartSlice';
import { ShoppingBag, Heart, Search, User, Sun, Moon, X, Menu, ArrowRight, Trash2, Check, Sparkles } from 'lucide-react';
import AiStylist from './AiStylist';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assetUrl';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryName?: (cat: string) => void;
}

export default function Layout({ children, activePage, setActivePage, setSelectedProductId, setSelectedCategoryName }: LayoutProps) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, coupon, giftWrap } = useSelector((state: RootState) => state.cart);
  const totals = useSelector((state: RootState) => getCartTotals(state.cart), shallowEqual);

  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Coupon input state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Dark Mode side effects
  useEffect(() => {
    const isDark = localStorage.getItem('shopez_dark') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('shopez_dark', String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Live product search suggestion
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/products?search=${searchQuery}`);
        setSearchResults(res.data.slice(0, 5));
      } catch (err) {
        // Fallback search locally if API fails
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await axios.post('/api/orders/coupon', { code: couponCodeInput });
      dispatch(applyCoupon({
        code: couponCodeInput.toUpperCase(),
        percent: res.data.percent,
        minSpent: res.data.minSpent
      }));
      setCouponSuccess(`Coupon applied successfully! ${res.data.percent}% off.`);
      setCouponCodeInput('');
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code.');
    }
  };

  const handleMoveToWishlist = async (item: any) => {
    if (!isAuthenticated) {
      alert("Please sign in to save items to your wishlist.");
      return;
    }
    try {
      await axios.post('/api/users/wishlist', { productId: item.product }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` }
      });
      const currentWish = user?.wishlist || [];
      if (!currentWish.includes(item.product)) {
        dispatch(updateWishlist([...currentWish, item.product]));
      }
      dispatch(removeFromCart({ product: item.product, size: item.size, color: item.color }));
    } catch (err) {
      dispatch(removeFromCart({ product: item.product, size: item.size, color: item.color }));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccess('');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-luxury-gold selection:text-white">
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div 
            onClick={() => { setActivePage('landing'); setSelectedProductId(null); }}
            className="cursor-pointer font-serif text-2xl font-bold tracking-[0.25em] text-luxury-charcoal dark:text-white"
          >
            SHOPEZ
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
            {['Men', 'Women', 'Kids', 'Accessories', 'Footwear'].map((cat) => (
              <button 
                key={cat}
                onClick={() => {
                  if (setSelectedCategoryName) {
                    setSelectedCategoryName(cat);
                  }
                  setActivePage('catalog');
                }}
                className="hover:text-luxury-gold transition-colors duration-200"
              >
                {cat}
              </button>
            ))}
            <button 
              onClick={() => setActivePage('catalog')}
              className="text-luxury-gold hover:opacity-85 transition-opacity"
            >
              Shop All
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5 text-neutral-700 dark:text-neutral-200">
            {/* Search Toggle */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-1 hover:text-luxury-gold transition-colors duration-150"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Dark Mode Switch */}
            <button 
              onClick={toggleDarkMode} 
              className="p-1 hover:text-luxury-gold transition-colors duration-150"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Profile */}
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setActivePage('profile');
                } else {
                  setActivePage('profile'); // Handles login/profile routing
                }
              }}
              className="p-1 hover:text-luxury-gold transition-colors duration-150 flex items-center gap-1.5"
            >
              <User className="w-4.5 h-4.5" />
              {isAuthenticated && user && (
                <span className="hidden lg:inline text-[10px] uppercase font-semibold tracking-wider">
                  {user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-1 hover:text-luxury-gold transition-colors duration-150 relative"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-luxury-gold text-luxury-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search autocomplete Bar */}
        {searchOpen && (
          <div className="absolute top-20 left-0 w-full bg-white dark:bg-luxury-matteBlack border-b border-neutral-100 dark:border-neutral-900 shadow-lg z-50 transition-all duration-300">
            <div className="max-w-3xl mx-auto px-6 py-6 relative">
              <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="SEARCH COLLECTION, PRODUCTS, BRAND..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-400 tracking-wider uppercase"
                  autoFocus
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                </button>
              </div>

              {/* Autocomplete Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400">Suggestions</span>
                  <div className="grid gap-2">
                    {searchResults.map(p => (
                      <div 
                        key={p._id}
                        onClick={() => {
                          setSelectedProductId(p._id);
                          setActivePage('product-details');
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                      >
                        <img src={resolveAssetUrl(p.images[0])} alt={p.name} className="w-12 h-12 object-cover" />
                        <div>
                          <div className="text-xs font-semibold uppercase">{p.name}</div>
                          <div className="text-[10px] text-luxury-gold">${p.price} <span className="text-neutral-400 italic font-light ml-2">{p.brand}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden flex">
          <div className="w-64 bg-white dark:bg-luxury-matteBlack h-full p-6 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-serif text-lg font-bold tracking-widest">SHOPEZ</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <nav className="flex flex-col gap-5 text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                {['Men', 'Women', 'Kids', 'Accessories', 'Footwear'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => {
                      if (setSelectedCategoryName) {
                        setSelectedCategoryName(cat);
                      }
                      setActivePage('catalog');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left hover:text-luxury-gold"
                  >
                    {cat}
                  </button>
                ))}
                <button 
                  onClick={() => { setActivePage('catalog'); setMobileMenuOpen(false); }}
                  className="text-left text-luxury-gold"
                >
                  Shop All
                </button>
              </nav>
            </div>
            
            {isAuthenticated ? (
              <button 
                onClick={() => { dispatch(logout()); setMobileMenuOpen(false); setActivePage('landing'); }}
                className="w-full py-3 bg-neutral-100 dark:bg-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => { setActivePage('profile'); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-luxury-charcoal text-white dark:bg-luxury-gold dark:text-luxury-charcoal text-xs font-bold uppercase tracking-widest"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer Sliding Panel */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-luxury-matteBlack h-full flex flex-col shadow-2xl relative border-l border-neutral-100 dark:border-neutral-900">
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-luxury-gold" />
                <h3 className="font-serif text-lg font-semibold tracking-wider">YOUR BAG</h3>
              </div>
              <button onClick={() => setCartOpen(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length > 0 && (
                <div className="p-4 border border-neutral-100 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-950/20 space-y-2 mb-2">
                  <div className="flex justify-between text-[9px] uppercase font-bold tracking-wider">
                    <span>Free Shipping Progress</span>
                    <span className="text-luxury-gold font-bold">
                      {totals.subtotal >= 200 
                        ? '🎉 Free Shipping Qualified!' 
                        : `$${(200 - totals.subtotal).toFixed(2)} away`}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-luxury-gold h-full transition-all duration-500" 
                      style={{ width: `${Math.min((totals.subtotal / 200) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-1" />
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Your shopping bag is empty.</p>
                  <button 
                    onClick={() => { setCartOpen(false); setActivePage('catalog'); }}
                    className="px-6 py-2.5 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-[10px] uppercase tracking-widest font-semibold hover:opacity-90"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                items.map(item => {
                  const itemPrice = item.price * (1 - item.discount / 100);
                  return (
                    <div 
                      key={`${item.product}-${item.size}-${item.color}`}
                      className="flex gap-4 p-3 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100/50 dark:border-neutral-900/50"
                    >
                      <img src={resolveAssetUrl(item.image) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} alt={item.name} className="w-20 h-24 object-cover" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[180px]">{item.name}</span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleMoveToWishlist(item)}
                                className="text-neutral-400 hover:text-luxury-gold p-0.5"
                                title="Move to Wishlist"
                              >
                                <Heart className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => dispatch(removeFromCart({ product: item.product, size: item.size, color: item.color }))}
                                className="text-neutral-400 hover:text-red-500 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-400 uppercase font-light">{item.size} / {item.color}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-neutral-200 dark:border-neutral-800">
                            <button 
                              onClick={() => dispatch(updateQuantity({ product: item.product, size: item.size, color: item.color, quantity: item.quantity - 1 }))}
                              className="px-2 py-0.5 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              -
                            </button>
                            <span className="px-3 py-0.5 text-xs font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ product: item.product, size: item.size, color: item.color, quantity: item.quantity + 1 }))}
                              className="px-2 py-0.5 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-bold text-luxury-gold">${(itemPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/20 space-y-4">
                
                {/* Coupon Application */}
                {coupon ? (
                  <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 px-3 py-2 text-xs">
                    <span className="text-green-700 dark:text-green-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Coupon Active: {coupon.code} (-{coupon.percent}%)
                    </span>
                    <button onClick={handleRemoveCoupon} className="text-neutral-400 hover:text-neutral-600 text-[10px] uppercase font-bold">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. EZNEW20)"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-luxury-gold"
                    />
                    <button type="submit" className="px-4 py-2 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-[10px] uppercase tracking-widest font-bold">Apply</button>
                  </form>
                )}
                {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-green-500 font-medium">{couponSuccess}</p>}

                {/* Pricing Summary */}
                <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Promo Discount</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Luxury Tax (18%)</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">${totals.tax.toFixed(2)}</span>
                  </div>
                  {totals.giftWrapCost > 0 && (
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Premium Gift Wrapping</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">$5.00</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b pb-2">
                    <span>Shipping</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-800 dark:text-neutral-100 font-bold pt-1.5">
                    <span>Grand Total</span>
                    <span className="text-luxury-gold">${totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Premium Gift Wrap Toggle */}
                <div className="flex items-center gap-2 pt-1 pb-2">
                  <input 
                    type="checkbox" 
                    id="giftwrap-checkbox"
                    checked={giftWrap}
                    onChange={() => dispatch(toggleGiftWrap())}
                    className="accent-luxury-gold cursor-pointer w-3.5 h-3.5"
                  />
                  <label htmlFor="giftwrap-checkbox" className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                    🎁 Add Premium Gift Wrap (+$5.00)
                  </label>
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={() => {
                    setCartOpen(false);
                     setActivePage('checkout');
                  }}
                  className="w-full py-4 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Floating AI Stylist Chatbot */}
      <AiStylist />

      {/* Footer */}
      <footer className="bg-luxury-charcoal text-neutral-400 py-16 px-6 font-sans border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-white text-lg tracking-widest font-semibold">SHOPEZ</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              Curated clothing, premium textures, and minimal aesthetics. Experience the absolute state of modern luxury shopping.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <span className="text-[10px] text-white uppercase font-bold tracking-widest">Collections</span>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => { if (setSelectedCategoryName) setSelectedCategoryName('Men'); setActivePage('catalog'); }} className="hover:text-white transition-colors">Men's Apparel</button></li>
              <li><button onClick={() => { if (setSelectedCategoryName) setSelectedCategoryName('Women'); setActivePage('catalog'); }} className="hover:text-white transition-colors">Women's Couture</button></li>
              <li><button onClick={() => { if (setSelectedCategoryName) setSelectedCategoryName('Kids'); setActivePage('catalog'); }} className="hover:text-white transition-colors">Kids Wear</button></li>
              <li><button onClick={() => { if (setSelectedCategoryName) setSelectedCategoryName('Accessories'); setActivePage('catalog'); }} className="hover:text-white transition-colors">Accessories & Timepieces</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <span className="text-[10px] text-white uppercase font-bold tracking-widest">Support</span>
            <ul className="text-xs space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide & Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fulfillment Tracking</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <span className="text-[10px] text-white uppercase font-bold tracking-widest">Newsletter</span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Subscribe to obtain updates on exclusive drops, styling catalogs, and premium campaigns.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-luxury-gold text-white placeholder-neutral-600"
              />
              <button className="px-4 bg-white text-luxury-charcoal text-[10px] font-bold uppercase hover:bg-luxury-gold hover:text-white transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-900 text-center text-[10px] text-neutral-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 ShopEZ Inc. Designed with premium Apple, Zara, and Nike inspiration. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Pinterest</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
