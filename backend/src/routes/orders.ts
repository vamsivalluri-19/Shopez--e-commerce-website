import { Router, Response } from 'express';
import { OrderRepository, ProductRepository } from '../models';
import { authenticate, AuthRequest } from '../utils/auth';

const router = Router();

// @route   POST /api/orders
// @desc    Create a new order & deduct inventory
router.post('/', authenticate as any, async (req: AuthRequest, res: Response) => {
  const { orderItems, shippingAddress, paymentMethod, pricing } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    // Validate and deduct stock
    for (const item of orderItems) {
      const product = await ProductRepository.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found.` });
      }
      if (product.inventory < item.quantity) {
        return res.status(400).json({ message: `Insufficient inventory for ${item.name}. Only ${product.inventory} units available.` });
      }
    }

    // Deduct stock
    for (const item of orderItems) {
      await ProductRepository.updateInventory(item.product, item.quantity);
    }

    const isPaid = paymentMethod !== 'Cash on Delivery'; // Mock paid for cards/UPI
    const order = await OrderRepository.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      pricing,
      isPaid,
      paidAt: isPaid ? new Date() : undefined,
      shippingStatus: 'Pending'
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error placing order.', error: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
router.get('/myorders', authenticate as any, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const orders = await OrderRepository.find({ user: req.user.id });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving your orders.', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details by ID
router.get('/:id', authenticate as any, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const order = await OrderRepository.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Authorized check: owner or admin
    const ownerId = order.user && (order.user._id ? order.user._id.toString() : order.user.toString());
    if (ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Unauthorized view.' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving order details.', error: error.message });
  }
});

// @route   POST /api/orders/coupon
// @desc    Validate discount coupons
router.post('/coupon', async (req, res) => {
  const { code } = req.body;
  try {
    const validCoupons: { [key: string]: { percent: number; minSpent: number } } = {
      'EZNEW20': { percent: 20, minSpent: 50 },
      'NIKE10': { percent: 10, minSpent: 40 },
      'ZARASALE': { percent: 15, minSpent: 100 },
      'FASHION30': { percent: 30, minSpent: 150 }
    };

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const upperCode = code.toUpperCase();
    const coupon = validCoupons[upperCode];

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code.' });
    }

    res.json({ message: 'Coupon applied successfully!', percent: coupon.percent, minSpent: coupon.minSpent });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error validating coupon.', error: error.message });
  }
});

export default router;
