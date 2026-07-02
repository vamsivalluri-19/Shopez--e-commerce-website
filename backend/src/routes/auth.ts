import { Router, Response } from 'express';
import { UserRepository, ProductRepository } from '../models';
import { hashPassword, comparePassword, generateToken, authenticate, AuthRequest } from '../utils/auth';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await UserRepository.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPasswordString = await hashPassword(password);
    const user = await UserRepository.create({
      name,
      email,
      password: hashedPasswordString,
      phone: phone || '',
      role: 'user',
      addresses: [],
      wishlist: []
    });

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await UserRepository.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
router.get('/profile', authenticate as any, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses || [],
      wishlist: user.wishlist || []
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
  }
});

// @route   POST /api/auth/address
// @desc    Add or update address
router.post('/address', authenticate as any, async (req: AuthRequest, res: Response) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserRepository.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = { street, city, state, zipCode, country, isDefault: isDefault || false };
    
    let updatedAddresses = [...(user.addresses || [])];
    if (isDefault) {
      // Set all other addresses default to false
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updated = await UserRepository.findByIdAndUpdate(req.user.id, { addresses: updatedAddresses });
    res.json({ message: 'Address added successfully', addresses: updated?.addresses || [] });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating address.', error: error.message });
  }
});

// @route   POST /api/auth/wishlist
// @desc    Toggle item in wishlist
router.post('/wishlist', authenticate as any, async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserRepository.findById(req.user.id);
    if (!user) return res.status(444).json({ message: 'User not found' });

    const product = await ProductRepository.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const wishlist = user.wishlist || [];
    const isExist = wishlist.some((id: any) => id.toString() === productId);

    let updated;
    if (isExist) {
      // Remove from wishlist
      updated = await UserRepository.findByIdAndUpdate(req.user.id, {
        $pull: { wishlist: productId }
      });
    } else {
      // Add to wishlist
      updated = await UserRepository.findByIdAndUpdate(req.user.id, {
        $push: { wishlist: productId }
      });
    }

    res.json({
      message: isExist ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: updated?.wishlist || []
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating wishlist.', error: error.message });
  }
});

export default router;
