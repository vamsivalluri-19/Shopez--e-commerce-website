import { Router, Request, Response } from 'express';
import { ProductRepository, ReviewRepository } from '../models';
import { authenticate, AuthRequest } from '../utils/auth';

const router = Router();

// @route   GET /api/products
// @desc    Get all products with filters (category, brand, price, search)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, brand, priceMin, priceMax, search, sort } = req.query;
    
    let products = await ProductRepository.find({
      category: category as string,
      brand: brand as string,
      priceMin: priceMin as string,
      priceMax: priceMax as string,
      search: search as string
    });

    // Sorting logic
    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      }
    }

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error fetching products.', error: error.message });
  }
});

// @route   GET /api/products/categories
// @desc    Get all unique categories and brands for filters
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const products = await ProductRepository.find({});
    const categories = Array.from(new Set(products.map(p => p.category)));
    const brands = Array.from(new Set(products.map(p => p.brand)));
    res.json({ categories, brands });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error fetching metadata.', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get product detail and reviews
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductRepository.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    
    const reviews = await ReviewRepository.find({ product: req.params.id });
    
    // Get similar products (same category, different id)
    const allOfCategory = await ProductRepository.find({ category: product.category });
    const similar = allOfCategory
      .filter(p => p._id.toString() !== req.params.id)
      .slice(0, 4);

    res.json({ product, reviews, similar });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error fetching product detail.', error: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a product review
router.post('/:id/reviews', authenticate as any, async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }

    const product = await ProductRepository.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const review = await ReviewRepository.create({
      user: req.user.id,
      userName: (req.user as any).name || req.user.email.split('@')[0],
      product: req.params.id,
      rating: Number(rating),
      comment
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error adding review.', error: error.message });
  }
});

export default router;
