import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { authStart, authSuccess, authFailure, logout, updateAddresses } from '../store/authSlice';
import { User, Mail, Lock, Phone, MapPin, Heart, ShoppingBag, Truck, Calendar, ShieldCheck } from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    google: any;
  }
}


interface ProfileProps {
  setActivePage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function Profile({ setActivePage, setSelectedProductId }: ProfileProps) {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  // Switch between Login and Register (when not authenticated)
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Logged in UI sections: 'profile' | 'addresses' | 'orders' | 'wishlist'
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'wishlist'>('profile');

  // Customer Orders State
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address add form state
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateStr, setStateStr] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Load orders if logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchMyOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await axios.get('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` }
          });
          setMyOrders(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchMyOrders();
    }
  }, [isAuthenticated, activeTab]);

  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    dispatch(authStart());
    try {
      const res = await axios.post('/api/auth/google', { token: idToken });
      dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Google authentication failed.';
      dispatch(authFailure(errMsg));
      setSubmitError(errMsg);
    }
  };

  useEffect(() => {
    let interval: any;
    if (!isAuthenticated && isLoginMode) {
      const initGoogle = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: "879535459202-3ifam87ectmujhg82quqedm9nlji8cu0.apps.googleusercontent.com",
            callback: handleGoogleCredentialResponse
          });
          const btnParent = document.getElementById("google-signin-btn");
          if (btnParent) {
            window.google.accounts.id.renderButton(
              btnParent,
              { theme: "outline", size: "large", width: 382 }
            );
          }
        }
      };

      if (window.google && window.google.accounts) {
        initGoogle();
      } else {
        interval = setInterval(() => {
          if (window.google && window.google.accounts) {
            initGoogle();
            clearInterval(interval);
          }
        }, 500);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, isLoginMode]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    dispatch(authStart());

    try {
      if (isLoginMode) {
        // Login
        const res = await axios.post('/api/auth/login', {
          email: emailInput,
          password: passwordInput
        });
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
      } else {
        // Register
        const res = await axios.post('/api/auth/register', {
          name: nameInput,
          email: emailInput,
          password: passwordInput,
          phone: phoneInput
        });
        dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Authentication error. Please retry.';
      dispatch(authFailure(errMsg));
      setSubmitError(errMsg);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/address', {
        street, city, state: stateStr, zipCode, country, isDefault
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` }
      });
      
      dispatch(updateAddresses(res.data.addresses));
      
      // Reset form
      setStreet('');
      setCity('');
      setStateStr('');
      setZipCode('');
      setCountry('');
      setIsDefault(false);
      alert('Address saved!');
    } catch (err) {
      console.error(err);
    }
  };

  // UNAUTHENTICATED: Show Login / Sign Up Forms
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 space-y-8 font-sans">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-luxury-gold font-bold">Secure Access Gateway</span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider">
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </h1>
          <div className="w-12 h-[2px] bg-luxury-gold mx-auto mt-2" />
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4 bg-white dark:bg-neutral-950 p-6 border shadow-sm">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="E.G. JANE DOE"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="premium-input pl-10 text-xs"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] uppercase text-neutral-500 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="+1 555 0199"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    className="premium-input pl-10 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[9px] uppercase text-neutral-500 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="YOURNAME@EXAMPLE.COM"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="premium-input pl-10 text-xs lowercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase text-neutral-500 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="premium-input pl-10 text-xs"
              />
            </div>
          </div>

          {(submitError || error) && (
            <p className="text-[10px] text-red-500 font-semibold">{submitError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-luxury py-4 mt-4"
          >
            {loading ? 'Authenticating...' : isLoginMode ? 'Secure Sign In' : 'Register Account'}
          </button>
        </form>

        {isLoginMode && (
          <div className="space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
              <span className="flex-shrink mx-4 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">OR</span>
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="w-full flex justify-center">
              <div id="google-signin-btn" className="w-full max-w-[382px]"></div>
            </div>
          </div>
        )}

        <div className="text-center text-xs">
          {isLoginMode ? (
            <p className="text-neutral-500 font-light">
              Don't have an account?{' '}
              <button 
                onClick={() => setIsLoginMode(false)}
                className="text-luxury-gold font-bold uppercase tracking-wider ml-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-neutral-500 font-light">
              Already have an account?{' '}
              <button 
                onClick={() => setIsLoginMode(true)}
                className="text-luxury-gold font-bold uppercase tracking-wider ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Show Profile dashboard
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4 flex justify-between items-baseline">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Fulfillment Center</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase mt-1">My Account</h1>
        </div>
        <div className="flex gap-4">
          {user.role === 'admin' && (
            <button 
              onClick={() => setActivePage('admin')}
              className="px-4 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-[10px] uppercase font-bold tracking-wider"
            >
              Admin Dashboard
            </button>
          )}
          <button 
            onClick={() => { dispatch(logout()); setActivePage('landing'); }}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 text-[10px] uppercase font-bold tracking-wider"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0 pr-0 md:pr-6 overflow-x-auto">
          {[
            { id: 'profile', label: 'Personal details', icon: User },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
            { id: 'orders', label: 'Order history', icon: ShoppingBag },
            { id: 'wishlist', label: 'Wishlist', icon: Heart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 md:border-b-0 md:border-l-2 transition-all ${
                activeTab === tab.id
                  ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* View Content details */}
        <div className="flex-1 space-y-6">
          
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 border space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">User Name</span>
                  <span className="font-semibold text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Email Registry</span>
                  <span className="font-semibold text-sm">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Mobile Contact</span>
                  <span className="font-semibold text-sm">{user.phone || 'No phone registered'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Membership Status</span>
                  <span className="font-bold text-luxury-gold uppercase text-xs flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-4 h-4" /> VIP Account ({user.role})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 border space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2">Add New Location</h2>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">Street Address</label>
                    <input
                      type="text" required placeholder="E.g. 221B Baker St" value={street}
                      onChange={e => setStreet(e.target.value)} className="premium-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">City</label>
                    <input
                      type="text" required placeholder="London" value={city}
                      onChange={e => setCity(e.target.value)} className="premium-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">State / Province</label>
                    <input
                      type="text" required placeholder="England" value={stateStr}
                      onChange={e => setStateStr(e.target.value)} className="premium-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">Zip / Postal Code</label>
                    <input
                      type="text" required placeholder="NW1 6XE" value={zipCode}
                      onChange={e => setZipCode(e.target.value)} className="premium-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">Country</label>
                    <input
                      type="text" required placeholder="United Kingdom" value={country}
                      onChange={e => setCountry(e.target.value)} className="premium-input text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox" id="default-check" checked={isDefault}
                      onChange={e => setIsDefault(e.target.checked)} className="accent-luxury-gold"
                    />
                    <label htmlFor="default-check" className="text-[10px] uppercase font-bold text-neutral-500 cursor-pointer">Set as default shipping address</label>
                  </div>
                  <button type="submit" className="md:col-span-2 btn-luxury py-3 mt-2">Save Location</button>
                </form>
              </div>

              {/* Saved Locations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Saved Locations</h3>
                {user.addresses?.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No saved addresses found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses?.map((addr, idx) => (
                      <div key={idx} className="p-4 border bg-white dark:bg-neutral-950 space-y-2 relative">
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 bg-luxury-gold/20 text-luxury-gold text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-full">Default</span>
                        )}
                        <div className="text-xs text-neutral-800 dark:text-neutral-200">
                          <p className="font-semibold">{addr.street}</p>
                          <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                          <p className="uppercase tracking-widest text-[9px] text-neutral-400 mt-1">{addr.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Orders History & Timelines */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2">Order Timeline Log</h2>
              {ordersLoading ? (
                <div className="h-40 flex items-center justify-center animate-pulse bg-neutral-50 dark:bg-neutral-900 border">
                  <span className="text-xs text-neutral-400">Loading Order History...</span>
                </div>
              ) : myOrders.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-center space-y-3 border border-dashed">
                  <ShoppingBag className="w-8 h-8 text-neutral-300 stroke-1" />
                  <p className="text-xs uppercase tracking-widest text-neutral-400">No order logs found.</p>
                  <button onClick={() => setActivePage('catalog')} className="btn-luxury py-2 text-[10px]">Shop Now</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {myOrders.map(order => (
                    <div key={order._id} className="border p-6 bg-white dark:bg-neutral-950 space-y-6">
                      
                      {/* Top Header */}
                      <div className="flex flex-col md:flex-row justify-between items-baseline gap-2 border-b pb-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold font-mono text-neutral-800 dark:text-neutral-200">ORDER ID: {order._id}</div>
                          <div className="text-[10px] text-neutral-400 font-light flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Ordered: {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-400 font-bold uppercase">Grand Total charged</div>
                          <div className="text-sm font-bold text-luxury-gold">${order.pricing.grandTotal.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center select-none pt-2">
                        {['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, stepIdx) => {
                          const statuses = ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
                          const currentIdx = statuses.indexOf(order.shippingStatus);
                          const isActive = stepIdx <= currentIdx;
                          const isCancelled = order.shippingStatus === 'Cancelled';

                          return (
                            <div key={step} className="space-y-1">
                              <div className={`mx-auto w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                isCancelled 
                                  ? 'border-red-200 bg-red-50 text-red-500' 
                                  : isActive 
                                    ? 'border-luxury-gold bg-luxury-gold text-luxury-charcoal' 
                                    : 'border-neutral-200 text-neutral-300'
                              }`}>
                                {isCancelled ? '✕' : stepIdx + 1}
                              </div>
                              <span className={`block text-[8px] uppercase tracking-wider font-semibold ${
                                isCancelled 
                                  ? 'text-red-500' 
                                  : isActive 
                                    ? 'text-neutral-800 dark:text-white font-bold' 
                                    : 'text-neutral-400'
                              }`}>
                                {isCancelled && stepIdx === 0 ? 'Cancelled' : step}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Items row */}
                      <div className="bg-neutral-50 dark:bg-neutral-900/30 p-4 space-y-3">
                        {order.orderItems.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-12 object-cover" />
                              <div>
                                <p className="font-semibold uppercase truncate max-w-[200px]">{item.name}</p>
                                <p className="text-[10px] text-neutral-400 uppercase font-light">{item.size} / {item.color} (x{item.quantity})</p>
                              </div>
                            </div>
                            <span className="font-semibold text-neutral-600 dark:text-neutral-400">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2">My Saved Favourites</h2>
              {/* Wishlist uses matching card grids */}
              {user.wishlist?.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-center space-y-3 border border-dashed">
                  <Heart className="w-8 h-8 text-neutral-300 stroke-1" />
                  <p className="text-xs uppercase tracking-widest text-neutral-400">Your wishlist is empty.</p>
                  <button onClick={() => setActivePage('catalog')} className="btn-luxury py-2 text-[10px]">Add Favourites</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Since wishlist is populated as IDs, we'd normally fetch details, to demonstrate we display an item mock or direct user back to shop */}
                  <p className="col-span-full text-xs text-neutral-400 italic">
                    Items are synced. Head over to the <button onClick={() => setActivePage('catalog')} className="text-luxury-gold underline uppercase font-bold ml-1">Catalog</button> to view details and check live pricing updates!
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
