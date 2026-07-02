import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/cartSlice';
import { fetchStart, fetchDetailSuccess, fetchFailure, addReviewLocal } from '../store/productSlice';
import { Heart, ShoppingBag, Star, Ruler, Sparkles, Send, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface ProductDetailsProps {
  productId: string;
  setActivePage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function ProductDetails({ productId, setActivePage, setSelectedProductId }: ProductDetailsProps) {
  const dispatch = useDispatch();
  const { selectedProduct: product, reviews, similar, loading, error } = useSelector((state: RootState) => state.products);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Selector States
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submitError, setSubmitError] = useState('');

  // AI Size Recommender State
  const [showAiSize, setShowAiSize] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitPref, setFitPref] = useState<'slim' | 'regular' | 'loose'>('regular');
  const [aiSizeResult, setAiSizeResult] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Fetch product detail on mount/id change
  useEffect(() => {
    const fetchDetail = async () => {
      dispatch(fetchStart());
      try {
        const res = await axios.get(`/api/products/${productId}`);
        dispatch(fetchDetailSuccess(res.data));
        
        // Defaults
        if (res.data.product.images?.length > 0) {
          setSelectedImage(res.data.product.images[0]);
        }
        if (res.data.product.sizes?.length > 0) {
          setSelectedSize(res.data.product.sizes[0]);
        }
        if (res.data.product.colors?.length > 0) {
          setSelectedColor(res.data.product.colors[0]);
        }
        // Reset reviews form
        setUserComment('');
        setUserRating(5);
        setSubmitError('');
      } catch (err: any) {
        dispatch(fetchFailure(err.response?.data?.message || 'Error fetching details.'));
      }
    };
    fetchDetail();
  }, [productId, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      category: product.category
    }));
    
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      setActivePage('profile'); // Send to register/login
      return;
    }
    try {
      await axios.post('/api/auth/wishlist', { productId: product?._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` }
      });
      // Toggle locally or trigger user profile reload
      // Triggering an alert for simplicity
      alert("Wishlist updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError('Authentication required to submit reviews.');
      return;
    }
    if (!userComment.trim()) {
      setSubmitError('Comment is required.');
      return;
    }
    setSubmitError('');

    try {
      const res = await axios.post(`/api/products/${productId}/reviews`, {
        rating: userRating,
        comment: userComment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` }
      });

      dispatch(addReviewLocal(res.data.review));
      setUserComment('');
      setUserRating(5);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Error uploading review.');
    }
  };

  const handleAiSizeRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;
    try {
      const res = await axios.post('/api/ai/size-recommend', {
        height,
        weight,
        fit: fitPref
      });
      setAiSizeResult(res.data.recommendedSize);
      
      // Auto-set the size selector if it matches available sizes
      const closest = product?.sizes.find(s => s.toLowerCase() === res.data.recommendedSize.toLowerCase());
      if (closest) {
        setSelectedSize(closest);
      }
    } catch (err) {
      setAiSizeResult('M');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2 aspect-[3/4] bg-neutral-200 dark:bg-neutral-900" />
        <div className="md:w-1/2 space-y-6">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-900 w-1/4" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-900 w-3/4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-900 w-1/3" />
          <div className="h-24 bg-neutral-200 dark:bg-neutral-900" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-red-500">Error Fetching Product</h2>
        <p className="text-neutral-500">{error || 'Product details not loaded.'}</p>
        <button onClick={() => setActivePage('catalog')} className="btn-luxury">Back to Catalog</button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 font-sans">
      
      {/* Product Presentation */}
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Images Grid */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="overflow-hidden bg-neutral-50 dark:bg-neutral-900/10 aspect-[3/4] border">
            <img 
              src={selectedImage || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all" 
            />
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 aspect-[3/4] border overflow-hidden ${selectedImage === img ? 'border-luxury-gold' : 'border-neutral-200'}`}
                >
                  <img src={img || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Configurations */}
        <div className="md:w-1/2 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Brand + Rating */}
            <div className="flex justify-between items-baseline border-b pb-4">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{product.brand}</span>
              <div className="flex items-center gap-1 text-luxury-gold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-neutral-400 font-light">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title + Price */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-luxury-gold">${discountedPrice.toFixed(2)}</span>
                {product.discount > 0 && (
                  <span className="text-sm line-through text-neutral-400 font-light">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">{product.description}</p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Available Colors</span>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-xs uppercase transition-all ${
                        selectedColor === color 
                          ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold font-semibold' 
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector + Size Recommender CTA */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Select Size</span>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setShowAiSize(!showAiSize)}
                      className="text-[10px] uppercase font-bold text-luxury-gold flex items-center gap-1 hover:opacity-85"
                    >
                      <Ruler className="w-3.5 h-3.5" /> AI Calculator
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1 hover:opacity-85"
                    >
                      📏 Size Chart
                    </button>
                  </div>
                </div>
                
                {/* Size Chips */}
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border flex items-center justify-center text-xs font-semibold transition-all ${
                        selectedSize === size 
                          ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' 
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {/* AI Size recommendation Panel Overlay */}
                {showAiSize && (
                  <form onSubmit={handleAiSizeRecommend} className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-luxury-gold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI RECOMMENDER
                      </span>
                      <button type="button" onClick={() => setShowAiSize(false)} className="text-neutral-400 hover:text-neutral-600">×</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase text-neutral-500 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          placeholder="e.g. 178"
                          value={height}
                          onChange={e => setHeight(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase text-neutral-500 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="e.g. 74"
                          value={weight}
                          onChange={e => setWeight(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-1.5 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-[9px] uppercase font-bold hover:opacity-90"
                      >
                        Compute Fit
                      </button>
                    </div>
                    {aiSizeResult && (
                      <div className="bg-white dark:bg-neutral-950 px-3 py-2 border text-[10px] text-green-700 dark:text-green-400 font-semibold uppercase">
                        ✓ Suggest Size: {aiSizeResult}
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Inventory Status */}
            <div className="text-[10px] font-semibold uppercase">
              Availability:{' '}
              {product.inventory > 0 ? (
                <span className="text-green-600">IN STOCK ({product.inventory} left)</span>
              ) : (
                <span className="text-red-500">OUT OF STOCK</span>
              )}
            </div>
          </div>

          {/* Add to Cart / Wishlist Actions */}
          <div className="space-y-4 pt-6 border-t">
            {addedNotify && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 text-green-700 dark:text-green-400 text-xs px-4 py-2.5 flex items-center justify-between">
                <span>✓ Successfully added to your shopping bag.</span>
                <button onClick={() => setActivePage('catalog')} className="text-[10px] uppercase font-bold">Continue Shopping</button>
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className="flex-1 btn-luxury flex items-center justify-center gap-2 py-4"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className="px-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 transition-colors flex items-center justify-center"
              >
                <Heart className="w-5 h-5 text-neutral-500 hover:text-red-500" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Review Logs */}
      <div className="border-t border-neutral-100 dark:border-neutral-900 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Add Review Panel */}
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Share Your Opinion</span>
          <h2 className="font-serif text-2xl font-bold">Submit Review</h2>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Select Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= userRating ? 'text-luxury-gold fill-current' : 'text-neutral-200 dark:text-neutral-800'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Review Comments</label>
              <textarea
                rows={4}
                required
                placeholder="YOUR REVIEW DESCRIPTION..."
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none focus:border-luxury-gold text-neutral-800 dark:text-white"
              />
            </div>
            {submitError && <p className="text-[10px] text-red-500 font-semibold">{submitError}</p>}
            
            <button
              type="submit"
              className="btn-luxury py-3 w-full flex items-center justify-center gap-1.5"
            >
              Post Review <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Fulfillment Feedback</span>
          <h2 className="font-serif text-2xl font-bold">Customer Reviews ({reviews.length})</h2>

          <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-950">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No customer reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map(rev => (
                <div key={rev._id} className="pt-4 space-y-2 first:pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">{rev.userName}</span>
                    <span className="text-[10px] text-neutral-400 font-light">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-luxury-gold">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'opacity-20'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Similar products shelf */}
      {similar && similar.length > 0 && (
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-16 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Outfit Completion</span>
            <h2 className="font-serif text-2xl font-bold">Similar Styling recommendations</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map(item => (
              <div 
                key={item._id}
                onClick={() => {
                  setSelectedProductId(item._id);
                  // page scroll reset
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer space-y-4"
              >
                <div className="overflow-hidden aspect-[3/4] bg-neutral-50 border">
                  <img src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} alt={item.name} className="w-full h-full object-cover hover-scale-luxury" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">{item.brand}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider truncate group-hover:text-luxury-gold">{item.name}</h3>
                  <span className="text-xs font-bold text-luxury-gold">${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-luxury-matteBlack w-full max-w-lg p-6 border dark:border-neutral-800 shadow-2xl relative">
            <button 
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 text-lg font-bold"
            >
              ✕
            </button>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Fit Details</span>
                <h3 className="font-serif text-lg font-bold uppercase">Standard Apparel Size Chart</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-500">
                      <th className="p-3">Size Tag</th>
                      <th className="p-3">Chest (in)</th>
                      <th className="p-3">Waist (in)</th>
                      <th className="p-3">Sleeve (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900 font-medium">
                    {[
                      { tag: 'XS', chest: '32 - 34', waist: '26 - 28', sleeve: '31.5 - 32' },
                      { tag: 'S', chest: '35 - 37', waist: '29 - 31', sleeve: '32.5 - 33' },
                      { tag: 'M', chest: '38 - 40', waist: '32 - 34', sleeve: '33.5 - 34' },
                      { tag: 'L', chest: '41 - 43', waist: '35 - 37', sleeve: '34.5 - 35' },
                      { tag: 'XL', chest: '44 - 46', waist: '38 - 40', sleeve: '35.5 - 36' }
                    ].map(row => (
                      <tr key={row.tag} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20">
                        <td className="p-3 font-bold text-luxury-gold">{row.tag}</td>
                        <td className="p-3">{row.chest}</td>
                        <td className="p-3">{row.waist}</td>
                        <td className="p-3">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 text-[10px] text-neutral-400 font-light leading-relaxed">
                *Measurements are in inches and represent standard body dimensions. Fits may vary slightly depending on garment designs and silhouette fits.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
