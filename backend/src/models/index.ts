import mongoose, { Schema, Document } from 'mongoose';
import fs from 'fs';
import path from 'path';

// --- MONGOOSE MODELS ---

// User Schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, default: '' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Product Schema
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  inventory: { type: Number, default: 10 },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Order Schema
const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: String,
    color: String,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: String,
    status: String,
    email_address: String
  },
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  shippingStatus: { type: String, enum: ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  deliveredAt: Date
}, { timestamps: true });

// Review Schema
const ReviewSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// --- FALLBACK DATABASE STATE & persistence ---

const FALLBACK_FILE = path.join(__dirname, '../../db_fallback.json');

export interface LocalDbState {
  users: any[];
  products: any[];
  orders: any[];
  reviews: any[];
}

let localDb: LocalDbState = {
  users: [],
  products: [],
  orders: [],
  reviews: []
};

// Load local database from file if it exists
function loadLocalDb() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      localDb = JSON.parse(data);
      console.log('Loaded local mock database from file:', FALLBACK_FILE);
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.error('Error loading mock database file, using empty memory store:', err);
  }
}

// Save local database state
export function saveLocalDb() {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local database state:', err);
  }
}

export let useMockDb = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez';
  try {
    mongoose.set('strictQuery', true);
    // Setting connection timeout low (3 seconds) to quickly fail over if Mongo isn't running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('Connected to MongoDB successfully!');
    useMockDb = false;
  } catch (error: any) {
    console.warn('\n⚠️ MongoDB Connection Failed:', error.message);
    console.warn('⚠️ Switching to Local JSON Mock Database fallback. All operations will persist to:');
    console.warn(`   ${FALLBACK_FILE}\n`);
    useMockDb = true;
    loadLocalDb();
  }
}

// Export repository interface to query seamlessly regardless of DB mode
export const UserRepository = {
  async find() {
    if (!useMockDb) return await UserModel.find({});
    return localDb.users;
  },
  async findOne(query: any) {
    if (!useMockDb) return await UserModel.findOne(query);
    return localDb.users.find(u => {
      for (const key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
  },
  async findById(id: string) {
    if (!useMockDb) return await UserModel.findById(id);
    return localDb.users.find(u => u._id === id);
  },
  async create(userData: any) {
    if (!useMockDb) {
      const newUser = new UserModel(userData);
      return await newUser.save();
    }
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...userData,
      addresses: userData.addresses || [],
      wishlist: userData.wishlist || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localDb.users.push(newUser);
    saveLocalDb();
    return newUser;
  },
  async findByIdAndUpdate(id: string, updateData: any, options: any = {}) {
    if (!useMockDb) return await UserModel.findByIdAndUpdate(id, updateData, { new: true, ...options });
    const index = localDb.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    
    const current = localDb.users[index];
    // Simple deep merge support for set fields
    const updated = {
      ...current,
      ...(updateData.$set || updateData),
      updatedAt: new Date().toISOString()
    };
    if (updateData.$push && updateData.$push.wishlist) {
      updated.wishlist = updated.wishlist || [];
      if (!updated.wishlist.includes(updateData.$push.wishlist)) {
        updated.wishlist.push(updateData.$push.wishlist);
      }
    }
    if (updateData.$pull && updateData.$pull.wishlist) {
      updated.wishlist = (updated.wishlist || []).filter((w: string) => w !== updateData.$pull.wishlist);
    }
    
    localDb.users[index] = updated;
    saveLocalDb();
    return updated;
  }
};

export const ProductRepository = {
  async find(filter: any = {}) {
    if (!useMockDb) {
      // Build dynamic mongoose search query
      const mongooseQuery: any = {};
      if (filter.category) mongooseQuery.category = filter.category;
      if (filter.brand) mongooseQuery.brand = filter.brand;
      if (filter.priceMin || filter.priceMax) {
        mongooseQuery.price = {};
        if (filter.priceMin) mongooseQuery.price.$gte = Number(filter.priceMin);
        if (filter.priceMax) mongooseQuery.price.$lte = Number(filter.priceMax);
      }
      if (filter.search) {
        mongooseQuery.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { brand: { $regex: filter.search, $options: 'i' } },
          { category: { $regex: filter.search, $options: 'i' } }
        ];
      }
      return await ProductModel.find(mongooseQuery);
    }
    
    // In-memory filter logic
    return localDb.products.filter(p => {
      if (filter.category && p.category.toLowerCase() !== filter.category.toLowerCase()) return false;
      if (filter.brand && p.brand.toLowerCase() !== filter.brand.toLowerCase()) return false;
      if (filter.priceMin && p.price < Number(filter.priceMin)) return false;
      if (filter.priceMax && p.price > Number(filter.priceMax)) return false;
      if (filter.search) {
        const s = filter.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(s);
        const matchesBrand = p.brand.toLowerCase().includes(s);
        const matchesCat = p.category.toLowerCase().includes(s);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }
      return true;
    });
  },
  async findById(id: string) {
    if (!useMockDb) return await ProductModel.findById(id);
    return localDb.products.find(p => p._id === id);
  },
  async create(productData: any) {
    if (!useMockDb) {
      const p = new ProductModel(productData);
      return await p.save();
    }
    const newProduct = {
      _id: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      reviewsCount: 0,
      discount: 0,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localDb.products.push(newProduct);
    saveLocalDb();
    return newProduct;
  },
  async updateInventory(id: string, qty: number) {
    if (!useMockDb) {
      return await ProductModel.findByIdAndUpdate(id, { $inc: { inventory: -qty } }, { new: true });
    }
    const index = localDb.products.findIndex(p => p._id === id);
    if (index !== -1) {
      localDb.products[index].inventory -= qty;
      if (localDb.products[index].inventory < 0) localDb.products[index].inventory = 0;
      saveLocalDb();
      return localDb.products[index];
    }
    return null;
  },
  // Used in seed file or dashboard
  async clear() {
    if (!useMockDb) {
      await ProductModel.deleteMany({});
    } else {
      localDb.products = [];
      saveLocalDb();
    }
  }
};

export const OrderRepository = {
  async find(query: any = {}) {
    if (!useMockDb) return await OrderModel.find(query).sort({ createdAt: -1 });
    // Filter orders locally
    let list = [...localDb.orders];
    if (query.user) {
      list = list.filter(o => o.user === query.user || (o.user && o.user._id === query.user));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  async findById(id: string) {
    if (!useMockDb) return await OrderModel.findById(id).populate('user', 'name email');
    const order = localDb.orders.find(o => o._id === id);
    if (!order) return null;
    const user = localDb.users.find(u => u._id === order.user);
    return {
      ...order,
      user: user ? { _id: user._id, name: user.name, email: user.email } : null
    };
  },
  async create(orderData: any) {
    if (!useMockDb) {
      const order = new OrderModel(orderData);
      return await order.save();
    }
    const newOrder = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...orderData,
      shippingStatus: 'Pending',
      isPaid: orderData.isPaid || false,
      paidAt: orderData.isPaid ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localDb.orders.push(newOrder);
    saveLocalDb();
    return newOrder;
  },
  async findByIdAndUpdate(id: string, updateData: any) {
    if (!useMockDb) return await OrderModel.findByIdAndUpdate(id, updateData, { new: true });
    const index = localDb.orders.findIndex(o => o._id === id);
    if (index === -1) return null;
    const current = localDb.orders[index];
    const updated = {
      ...current,
      ...(updateData.$set || updateData),
      updatedAt: new Date().toISOString()
    };
    localDb.orders[index] = updated;
    saveLocalDb();
    return updated;
  }
};

export const ReviewRepository = {
  async find(query: any = {}) {
    if (!useMockDb) return await ReviewModel.find(query).sort({ createdAt: -1 });
    return localDb.reviews
      .filter(r => r.product === query.product)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  async create(reviewData: any) {
    if (!useMockDb) {
      const r = new ReviewModel(reviewData);
      const savedReview = await r.save();
      // Recalculate average rating
      const reviews = await ReviewModel.find({ product: reviewData.product });
      const avgRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
      await ProductModel.findByIdAndUpdate(reviewData.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviews.length
      });
      return savedReview;
    }
    
    const newReview = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localDb.reviews.push(newReview);
    
    // Recalculate product rating locally
    const prodReviews = localDb.reviews.filter(r => r.product === reviewData.product);
    const avgRating = prodReviews.reduce((sum, rev) => sum + rev.rating, 0) / prodReviews.length;
    
    const prodIndex = localDb.products.findIndex(p => p._id === reviewData.product);
    if (prodIndex !== -1) {
      localDb.products[prodIndex].rating = Math.round(avgRating * 10) / 10;
      localDb.products[prodIndex].reviewsCount = prodReviews.length;
    }
    
    saveLocalDb();
    return newReview;
  }
};

export { localDb };
