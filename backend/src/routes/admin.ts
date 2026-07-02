import { Router, Response } from 'express';
import { OrderRepository, ProductRepository, UserRepository, useMockDb, localDb } from '../models';
import { authenticate, authorizeAdmin, AuthRequest } from '../utils/auth';

const router = Router();

// Apply admin access control to all routes here
router.use(authenticate as any);
router.use(authorizeAdmin as any);

// @route   GET /api/admin/analytics
// @desc    Get dashboard metrics & sales details
router.get('/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await OrderRepository.find({});
    const products = await ProductRepository.find({});
    const users = await UserRepository.find();

    // Calculations
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalRevenue = orders
      .filter((o: any) => o.shippingStatus !== 'Cancelled' && (o.isPaid || o.paymentMethod === 'Cash on Delivery'))
      .reduce((sum: number, o: any) => sum + o.pricing.grandTotal, 0);

    const outOfStock = products.filter((p: any) => p.inventory === 0).length;

    // Sales by Category
    const categorySales: { [key: string]: number } = {};
    orders.forEach((o: any) => {
      if (o.shippingStatus !== 'Cancelled') {
        o.orderItems.forEach((item: any) => {
          const cat = item.category || 'Other';
          categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    const categoryStats = Object.keys(categorySales).map(key => ({
      name: key,
      value: Math.round(categorySales[key])
    }));

    res.json({
      metrics: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalUsers,
        outOfStock
      },
      categoryStats,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving analytics.', error: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all customer orders
router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await OrderRepository.find({});
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving order logs.', error: error.message });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order shipping status
router.put('/orders/:id/status', async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  try {
    if (!['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid shipping status.' });
    }

    const order = await OrderRepository.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updateFields: any = { shippingStatus: status };
    if (status === 'Delivered') {
      updateFields.deliveredAt = new Date();
      updateFields.isPaid = true; // Mark paid on delivery
    }

    const updated = await OrderRepository.findByIdAndUpdate(req.params.id, { $set: updateFields });
    res.json({ message: 'Order status updated successfully', order: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating order status.', error: error.message });
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product
router.post('/products', async (req: AuthRequest, res: Response) => {
  const { name, description, price, discount, brand, category, images, sizes, colors, inventory } = req.body;
  try {
    if (!name || !description || !price || !brand || !category) {
      return res.status(400).json({ message: 'Product name, description, price, brand, and category are required.' });
    }

    const product = await ProductRepository.create({
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      brand,
      category,
      images: images || ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'],
      sizes: sizes || ['M', 'L'],
      colors: colors || ['Black'],
      inventory: Number(inventory) || 10
    });

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users list
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await UserRepository.find();
    // Exclude password from response
    const sanitizedUsers = users.map((u: any) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      createdAt: u.createdAt
    }));
    res.json(sanitizedUsers);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving users.', error: error.message });
  }
});

export default router;
