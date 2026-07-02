import { Router, Request, Response } from 'express';
import { ProductRepository } from '../models';

const router = Router();

// @route   POST /api/ai/size-recommend
// @desc    Determine appropriate size based on user height, weight and fit
router.post('/size-recommend', async (req: Request, res: Response) => {
  const { height, weight, fit } = req.body; // height in cm, weight in kg, fit: 'slim' | 'regular' | 'loose'
  try {
    if (!height || !weight) {
      return res.status(400).json({ message: 'Height (cm) and Weight (kg) are required.' });
    }

    const h = Number(height);
    const w = Number(weight);
    
    // Simple heuristic size recommender
    let size = 'M';
    const bmi = w / ((h / 100) * (h / 100));

    if (bmi < 18.5) {
      size = 'S';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      size = 'M';
    } else if (bmi >= 24.9 && bmi < 29.9) {
      size = 'L';
    } else {
      size = 'XL';
    }

    // Adjust based on fit preference
    if (fit === 'slim') {
      if (size === 'XL') size = 'L';
      else if (size === 'L') size = 'M';
      else if (size === 'M') size = 'S';
      else size = 'XS';
    } else if (fit === 'loose') {
      if (size === 'XS') size = 'S';
      else if (size === 'S') size = 'M';
      else if (size === 'M') size = 'L';
      else if (size === 'L') size = 'XL';
      else size = 'XXL';
    }

    res.json({
      recommendedSize: size,
      explanation: `Based on your BMI of ${bmi.toFixed(1)} (${bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal weight' : 'Overweight'}) and preference for a ${fit || 'regular'} fit.`
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error calculating size recommendation.', error: error.message });
  }
});

// @route   POST /api/ai/chat
// @desc    Mock LLM chatbot for styling queries
router.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  try {
    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const query = message.toLowerCase();
    const products = await ProductRepository.find({});
    
    let reply = "I'm your ShopEZ AI Stylist. Tell me what type of style you are looking for (e.g. casual, sports, formal, jackets) or ask for outfit recommendations!";
    let recommendedProducts: any[] = [];

    if (query.includes('shoe') || query.includes('sneaker') || query.includes('footwear')) {
      reply = "For shoes, I highly recommend our active-fit sneakers. They feature breathable knit design and dual-density foam - perfect for casual styles or high performance.";
      recommendedProducts = products.filter(p => p.category === 'Footwear');
    } else if (query.includes('coat') || query.includes('trench') || query.includes('jacket') || query.includes('winter') || query.includes('hoodie')) {
      reply = "Layering is key for clean silhouettes. Check out our Premium Cashmere Trench Coat for elegance, or our Heavyweight Fleece Hoodie for dynamic streetwear vibes.";
      recommendedProducts = products.filter(p => p.name.toLowerCase().includes('coat') || p.name.toLowerCase().includes('hoodie') || p.name.toLowerCase().includes('jacket'));
    } else if (query.includes('women') || query.includes('dress') || query.includes('saree') || query.includes('floral')) {
      reply = "For women's styling, our Floral Summer Maxi Dress is trending now. You can match it with the Minimalist Leather Crossbody Bag for a luxurious evening look.";
      recommendedProducts = products.filter(p => p.category === 'Women');
    } else if (query.includes('men') || query.includes('shirt') || query.includes('casual')) {
      reply = "For a classic, casual men's look, we recommend starting with the Oversized Heavyweight Fleece Hoodie paired with Denim Trucker Jacket. It is versatile, premium, and keeps you warm.";
      recommendedProducts = products.filter(p => p.category === 'Men');
    } else if (query.includes('accessory') || query.includes('watch') || query.includes('bag') || query.includes('glass')) {
      reply = "Accessories elevate a outfit from standard to premium. A Rolex Submariner Watch or Ray-Ban Aviators adds timeless prestige to any casual or formal wear.";
      recommendedProducts = products.filter(p => p.category === 'Accessories');
    } else if (query.includes('outfit') || query.includes('suggest') || query.includes('match')) {
      reply = "Here's a curated outfit styling suggestion: Pair our Oversized Heavyweight Hoodie (Sage Green) with classic knit sneakers. Complete the look with Titanium Aviator Sunglasses for a modern luxury streetwear aesthetic.";
      recommendedProducts = products.slice(0, 3);
    } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
      reply = "Hello! I am your ShopEZ AI Personal Shopping Assistant. I can help you find products, calculate your perfect fit, or suggest complete outfit matching combinations. What are you shopping for today?";
    }

    res.json({
      reply,
      products: recommendedProducts
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error processing AI chat query.', error: error.message });
  }
});

export default router;
