import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { clearCart, getCartTotals } from '../store/cartSlice';
import { CreditCard, Truck, CheckCircle2, QrCode, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assetUrl';

interface CheckoutProps {
  setActivePage: (page: string) => void;
}

export default function Checkout({ setActivePage }: CheckoutProps) {
  const dispatch = useDispatch();
  const { items, shippingMethod } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const totals = useSelector((state: RootState) => getCartTotals(state.cart), shallowEqual);

  // Address State
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || {
    street: '', city: '', state: '', zipCode: '', country: ''
  };
  const [street, setStreet] = useState(defaultAddress.street);
  const [city, setCity] = useState(defaultAddress.city);
  const [state, setState] = useState(defaultAddress.state);
  const [zipCode, setZipCode] = useState(defaultAddress.zipCode);
  const [country, setCountry] = useState(defaultAddress.country);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'Stripe Credit Card' | 'Razorpay UPI' | 'Cash on Delivery'>('Stripe Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Delivery Option overrides
  const [deliveryOption, setDeliveryOption] = useState<'Standard' | 'Express' | 'Overnight'>('Standard');

  const getShippingFee = () => {
    if (deliveryOption === 'Standard') return totals.shipping;
    if (deliveryOption === 'Express') return 15;
    if (deliveryOption === 'Overnight') return 35;
    return 0;
  };

  const finalShipping = getShippingFee();
  const shippingDiff = finalShipping - totals.shipping;
  const finalGrandTotal = totals.grandTotal + shippingDiff;

  // Submit flow
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');
    setLoading(true);

    const orderPayload = {
      orderItems: items.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image,
        category: item.category
      })),
      shippingAddress: { street, city, state, zipCode, country },
      paymentMethod,
      pricing: {
        ...totals,
        shipping: finalShipping,
        grandTotal: finalGrandTotal
      }
    };

    try {
      const headers: any = {};
      if (isAuthenticated) {
        headers.Authorization = `Bearer ${localStorage.getItem('shopez_token')}`;
      } else {
        // Guest checkout not strictly blocked but if token exists, send it
        const tok = localStorage.getItem('shopez_token');
        if (tok) headers.Authorization = `Bearer ${tok}`;
      }

      const res = await axios.post('/api/orders', orderPayload, { headers });
      setOrderSuccess(res.data.order);
      dispatch(clearCart());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing payment and creating order. Check stock levels.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-8 font-sans">
        <div className="flex justify-center text-green-500">
          <CheckCircle2 className="w-16 h-16 stroke-1 animate-bounce" />
        </div>
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Transaction Successful</span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider">Thank You for Your Order!</h1>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
            Your payment was processed. We are packing your premium outfit drops.
          </p>
        </div>
        
        {/* Order Details Panel */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border text-left space-y-4">
          <div className="flex justify-between items-baseline border-b pb-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Order Reference ID</span>
            <span className="text-xs font-bold font-mono text-luxury-gold">{orderSuccess._id}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Estimated Delivery</span>
            <span className="text-xs font-bold">3 - 5 Business Days</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Payment Gateway</span>
            <span className="text-xs font-semibold">{paymentMethod}</span>
          </div>
          <div className="flex justify-between items-baseline border-t pt-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Charged</span>
            <span className="text-sm font-bold text-luxury-gold">${orderSuccess.pricing.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setActivePage('catalog')}
            className="btn-luxury"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => setActivePage('profile')}
            className="btn-outline-luxury"
          >
            Track Order
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6 font-sans">
        <Truck className="w-12 h-12 text-neutral-300 stroke-1 mx-auto" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Your cart is empty. Nothing to checkout.</p>
        <button onClick={() => setActivePage('catalog')} className="btn-luxury">Go to Catalog</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 font-sans">
      
      {/* Page Title */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Safe SSL Transaction</span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase mt-1">Secure Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Shipping & Payment Forms */}
        <div className="flex-1 space-y-8">
          
          {/* Shipping fields */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-luxury-gold" /> 1. Shipping Address
            </h2>
            {isAuthenticated && user && user.addresses && user.addresses.length > 0 && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border mb-2">
                <label className="block text-[9px] uppercase text-neutral-400 font-bold mb-2">Use Saved Location</label>
                <div className="flex flex-wrap gap-2">
                  {user.addresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setStreet(addr.street);
                        setCity(addr.city);
                        setState(addr.state || '');
                        setZipCode(addr.zipCode || '');
                        setCountry(addr.country || '');
                      }}
                      className="px-3 py-2 border text-[10px] uppercase font-semibold hover:border-luxury-gold bg-white dark:bg-neutral-950"
                    >
                      📍 {addr.street}, {addr.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Broadway Suite"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="premium-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="New York"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="premium-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  placeholder="NY"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="premium-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">Zip / Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="10001"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="premium-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">Country</label>
                <input
                  type="text"
                  required
                  placeholder="United States"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="premium-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Delivery Options Selector */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-luxury-gold" /> 2. Delivery Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'Standard', label: 'Standard Delivery', time: '3 - 5 Business Days', fee: totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}` },
                { id: 'Express', label: 'Express Delivery', time: '1 - 2 Business Days', fee: '$15.00' },
                { id: 'Overnight', label: 'Overnight Courier', time: 'Next Day Delivery', fee: '$35.00' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDeliveryOption(opt.id as any)}
                  className={`p-4 border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                    deliveryOption === opt.id 
                      ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold font-semibold' 
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">{opt.label}</span>
                  <span className="text-[9px] text-neutral-400 font-light">{opt.time}</span>
                  <span className="text-xs font-bold text-luxury-gold mt-1">{opt.fee}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-luxury-gold" /> 3. Payment Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { type: 'Stripe Credit Card', label: 'Credit / Debit Card', icon: CreditCard },
                { type: 'Razorpay UPI', label: 'UPI QR Code / ID', icon: QrCode },
                { type: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck }
              ].map(method => (
                <button
                  key={method.type}
                  type="button"
                  onClick={() => setPaymentMethod(method.type as any)}
                  className={`p-4 border flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === method.type 
                      ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold font-semibold' 
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider">{method.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-form based on selection */}
            {paymentMethod === 'Stripe Credit Card' && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border space-y-4">
                <div>
                  <label className="block text-[9px] uppercase text-neutral-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="premium-input text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="premium-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="premium-input text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Razorpay UPI' && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border space-y-4">
                <div>
                  <label className="block text-[9px] uppercase text-neutral-500 mb-1">UPI Address (VPA)</label>
                  <input
                    type="text"
                    required
                    placeholder="jane@oksbi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="premium-input text-xs"
                  />
                </div>
                <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                  <QrCode className="w-8 h-8 text-luxury-gold shrink-0" />
                  <p>A secure QR code request will be pinged to your UPI application upon final click.</p>
                </div>
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 border text-xs text-neutral-500 leading-relaxed font-light">
                Please prepare payment of <strong className="text-neutral-800 dark:text-neutral-200">${finalGrandTotal.toFixed(2)}</strong> in cash when our courier delivery personnel delivers to your door.
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Order summary sticky sidebar */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="border p-6 bg-white dark:bg-neutral-950 space-y-6 sticky top-24">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider border-b pb-3">Order Summary</h3>

            {/* Line items thumbnail list */}
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={`${item.product}-${item.size}-${item.color}`} className="flex gap-3 text-xs border-b pb-3 last:border-0 last:pb-0">
                  <img src={resolveAssetUrl(item.image) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'} alt={item.name} className="w-12 h-16 object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold truncate uppercase tracking-wider">{item.name}</div>
                      <div className="text-[10px] text-neutral-400 font-light">{item.size} / {item.color} (x{item.quantity})</div>
                    </div>
                    <div className="text-right font-bold text-luxury-gold">${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs border-t pt-4 text-neutral-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-${totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Luxury GST/Tax (18%)</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              {totals.giftWrapCost > 0 && (
                <div className="flex justify-between">
                  <span>Premium Gift Wrapping</span>
                  <span>$5.00</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span>Shipping Fees</span>
                <span>{finalShipping === 0 ? 'FREE' : `$${finalShipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-800 dark:text-white pt-2">
                <span>Final Grand Total</span>
                <span className="text-luxury-gold">${finalGrandTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}

            {/* Checkout CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-luxury flex items-center justify-center gap-1.5 py-4 disabled:opacity-50"
            >
              {loading ? 'Processing Transaction...' : 'Place Secure Order'} <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" /> Encrypted SSL Gateway
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
