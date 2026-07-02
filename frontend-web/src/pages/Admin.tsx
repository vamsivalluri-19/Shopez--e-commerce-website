import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ShieldAlert, Plus, BarChart2, Inbox, Users, Package, RefreshCw, Layers } from 'lucide-react';
import axios from 'axios';

interface AdminProps {
  setActivePage: (page: string) => void;
}

export default function Admin({ setActivePage }: AdminProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check admin role
  const isAdmin = isAuthenticated && user && user.role === 'admin';

  // Subsections: 'analytics' | 'products' | 'orders' | 'users'
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');

  // Dashboard Stats
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, outOfStock: 0 });
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  
  // Lists
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodInventory, setProdInventory] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodColors, setProdColors] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Fetch metrics & dashboard details
  const fetchDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` };
      
      // Analytics
      const analRes = await axios.get('/api/admin/analytics', { headers });
      setMetrics(analRes.data.metrics);
      setCategoryStats(analRes.data.categoryStats);
      
      // Orders
      const ordRes = await axios.get('/api/admin/orders', { headers });
      setAllOrders(ordRes.data);

      // Users
      const usrRes = await axios.get('/api/admin/users', { headers });
      setAllUsers(usrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin, activeSubTab]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess('');
    const sizesArr = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map(c => c.trim()).filter(Boolean);

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` };
      await axios.post('/api/admin/products', {
        name: prodName,
        brand: prodBrand,
        category: prodCategory,
        price: Number(prodPrice),
        discount: Number(prodDiscount) || 0,
        inventory: Number(prodInventory) || 10,
        description: prodDescription,
        sizes: sizesArr,
        colors: colorsArr
      }, { headers });

      setSubmitSuccess('Product registered and added to shop catalog!');
      // Reset form
      setProdName('');
      setProdBrand('');
      setProdCategory('');
      setProdPrice('');
      setProdDiscount('');
      setProdInventory('');
      setProdDescription('');
      setProdSizes('');
      setProdColors('');
    } catch (err: any) {
      alert('Error creating product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('shopez_token')}` };
      await axios.put(`/api/admin/orders/${orderId}/status`, { status }, { headers });
      alert('Order status updated!');
      fetchDashboardData(); // Reload list
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6 font-sans">
        <ShieldAlert className="w-16 h-16 text-red-500 stroke-1 mx-auto" />
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold uppercase">Restricted Area</h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Admin credentials and token keys are required to access this dashboard.
          </p>
        </div>
        <button onClick={() => setActivePage('profile')} className="btn-luxury">Access Credentials Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 font-sans">
      
      {/* Page Title */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4 flex justify-between items-baseline">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Systems Administration</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase mt-1">Management Hub</h1>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-2 border hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full text-neutral-500"
          title="Reload system stats"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-4">
        {[
          { id: 'analytics', label: 'Financial Metrics', icon: BarChart2 },
          { id: 'products', label: 'Create Product', icon: Plus },
          { id: 'orders', label: 'Fulfillment Logs', icon: Inbox },
          { id: 'users', label: 'User Directory', icon: Users }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-semibold border ${
              activeSubTab === sub.id
                ? 'border-luxury-gold bg-luxury-gold text-luxury-charcoal'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
            }`}
          >
            <sub.icon className="w-3.5 h-3.5" />
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="h-40 flex items-center justify-center animate-pulse border">
          <span className="text-xs text-neutral-400 uppercase tracking-widest">Querying database...</span>
        </div>
      )}

      {/* analytics Subtab */}
      {!loading && activeSubTab === 'analytics' && (
        <div className="space-y-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: `$${metrics.totalRevenue}`, desc: 'Excluding cancellations', icon: BarChart2 },
              { label: 'System Orders', value: metrics.totalOrders, desc: 'All customer entries', icon: Inbox },
              { label: 'Active Users', value: metrics.totalUsers, desc: 'Registered accounts', icon: Users },
              { label: 'Out of Stock', value: metrics.outOfStock, desc: 'Needs replenishment', icon: Package }
            ].map((metric, i) => (
              <div key={i} className="p-6 border bg-white dark:bg-neutral-950 space-y-2 relative">
                <metric.icon className="w-8 h-8 text-neutral-100 dark:text-neutral-900 absolute right-6 top-6" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">{metric.label}</span>
                <span className="text-2xl font-bold text-luxury-gold font-mono">{metric.value}</span>
                <span className="text-[10px] text-neutral-400 block font-light">{metric.desc}</span>
              </div>
            ))}
          </div>

          {/* Sales by Category Custom Chart */}
          <div className="border p-6 bg-white dark:bg-neutral-950 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Category Sales Breakdown</span>
              <h3 className="font-serif text-lg font-bold">Fulfillment Share by Division</h3>
            </div>
            
            {categoryStats.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No sales logs to plot.</p>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((stat, idx) => {
                  const maxVal = Math.max(...categoryStats.map(s => s.value)) || 1;
                  const pct = (stat.value / maxVal) * 100;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-luxury-gold" /> {stat.name}
                        </span>
                        <span className="text-luxury-gold font-mono">${stat.value}</span>
                      </div>
                      <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-900">
                        <div 
                          className="h-full bg-luxury-gold transition-all duration-1000" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* products Subtab (Create Product) */}
      {!loading && activeSubTab === 'products' && (
        <form onSubmit={handleCreateProduct} className="max-w-2xl bg-neutral-50 dark:bg-neutral-900/30 p-8 border space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 border-b pb-2">Product Configurations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Product Name</label>
              <input
                type="text" required placeholder="e.g. Classic Trench Coat" value={prodName}
                onChange={e => setProdName(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Brand Name</label>
              <input
                type="text" required placeholder="e.g. Zara" value={prodBrand}
                onChange={e => setProdBrand(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Division Category</label>
              <select
                required value={prodCategory} onChange={e => setProdCategory(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-luxury-gold uppercase text-xs tracking-wider"
              >
                <option value="">Choose category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Price ($)</label>
              <input
                type="number" required placeholder="e.g. 195" value={prodPrice}
                onChange={e => setProdPrice(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Discount (%)</label>
              <input
                type="number" placeholder="e.g. 10" value={prodDiscount}
                onChange={e => setProdDiscount(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Initial Stock quantity</label>
              <input
                type="number" required placeholder="e.g. 25" value={prodInventory}
                onChange={e => setProdInventory(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Sizes (split with comma)</label>
              <input
                type="text" placeholder="e.g. S, M, L, XL" value={prodSizes}
                onChange={e => setProdSizes(e.target.value)} className="premium-input text-xs uppercase"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Colors (split with comma)</label>
              <input
                type="text" placeholder="e.g. Black, White, Beige" value={prodColors}
                onChange={e => setProdColors(e.target.value)} className="premium-input text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase text-neutral-500 mb-1">Product Description</label>
              <textarea
                rows={4} required placeholder="Detailed specifications..." value={prodDescription}
                onChange={e => setProdDescription(e.target.value)} className="premium-input text-xs"
              />
            </div>
          </div>

          {submitSuccess && <p className="text-[10px] text-green-600 font-bold uppercase">{submitSuccess}</p>}

          <button type="submit" className="btn-luxury py-3.5 w-full">Register Product</button>
        </form>
      )}

      {/* orders Subtab */}
      {!loading && activeSubTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Order Logs</h2>
          
          {allOrders.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No orders registered on platform yet.</p>
          ) : (
            <div className="border overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Charged Amount</th>
                    <th className="p-4">Paid State</th>
                    <th className="p-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {allOrders.map(order => (
                    <tr key={order._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20">
                      <td className="p-4 font-mono font-bold text-luxury-gold select-all">{order._id}</td>
                      <td className="p-4">{order.user?.name || 'Guest/Offline'} <br /> <span className="text-[10px] text-neutral-400">{order.user?.email || ''}</span></td>
                      <td className="p-4 font-bold font-mono">${order.pricing.grandTotal.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full ${
                          order.isPaid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.shippingStatus}
                          onChange={e => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="px-2 py-1 bg-transparent border border-neutral-200 dark:border-neutral-800 text-xs font-semibold focus:outline-none uppercase"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* users Subtab */}
      {!loading && activeSubTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">User Registry Directory</h2>
          
          {allUsers.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No users found.</p>
          ) : (
            <div className="border overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {allUsers.map(usr => (
                    <tr key={usr._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20">
                      <td className="p-4 font-bold">{usr.name}</td>
                      <td className="p-4 lowercase">{usr.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full ${
                          usr.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-4 font-light text-neutral-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
