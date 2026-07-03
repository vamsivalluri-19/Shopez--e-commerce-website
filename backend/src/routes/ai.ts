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
      reply = "For footwear, I highly recommend our AeroKnit Cushioned Trainers in the Men's section. They feature a breathable knit design and responsive impact cushioning - perfect for active or casual styling.";
      recommendedProducts = products.filter(p => p.name.toLowerCase().includes('trainers'));
    } else if (query.includes('coat') || query.includes('trench') || query.includes('outerwear') || query.includes('tunic') || query.includes('dress') || query.includes('kurta') || query.includes('palazzo')) {
      reply = "For elegant ethnic looks, check out our Women’s White Elephant & Umbrella Printed A-Line Kurta with Palazzo Set, or our Zara Cashmere Trench Coat for a premium daily outerwear option.";
      recommendedProducts = products.filter(p => p.name.toLowerCase().includes('kurta') || p.name.toLowerCase().includes('coat'));
    } else if (query.includes('women') || query.includes('dress') || query.includes('tunic') || query.includes('girl') || query.includes('female') || query.includes('kurta') || query.includes('palazzo')) {
      reply = "For women's fashion, our Women’s White Elephant & Umbrella Printed A-Line Kurta with Palazzo Set is our highlighted piece. It is crafted from premium Viscose Rayon with beautiful elephant and umbrella print work.";
      recommendedProducts = products.filter(p => p.category === 'Women');
    } else if (query.includes('men') || query.includes('shirt') || query.includes('casual') || query.includes('male') || query.includes('boy')) {
      reply = "For men's fashion, we offer the Casual Cotton Shirt, the Premium Linen Shirt, and the Zara Cashmere Trench Coat. These provide a highly versatile, premium, and comfortable wardrobe.";
      recommendedProducts = products.filter(p => p.category === 'Men');
    } else if (query.includes('laptop') || query.includes('computer') || query.includes('macbook') || query.includes('lenovo')) {
      reply = "For laptops and high-performance productivity, our Lenovo laptop collection (including the Lenovo Yoga Book 9 and Lenovo LOQ 2025) offers outstanding choices.";
      recommendedProducts = products.filter(p => p.category === 'Laptops');
    } else if (query.includes('accessory') || query.includes('headphone') || query.includes('noise')) {
      reply = "For premium audio and styling accessories, check out our Noise Airwave Max 4 Bluetooth Headphones featuring 70 hours of playtime and environmental noise cancellation.";
      recommendedProducts = products.filter(p => p.category === 'Accessories');
    } else if (query.includes('outfit') || query.includes('suggest') || query.includes('match') || query.includes('color')) {
      reply = "Here's a curated outfit styling suggestion: Pair our Casual Cotton Shirt with the Zara Cashmere Trench Coat. Complete the look with our AeroKnit Cushioned Trainers for a modern, active luxury aesthetic. For women, the Women’s White Elephant & Umbrella Printed A-Line Kurta with Palazzo Set offers a complete, elegant outfit.";
      recommendedProducts = products.filter(p => ['shirt', 'coat', 'trainers', 'kurta'].some(kw => p.name.toLowerCase().includes(kw)));
    } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
      reply = "Hello! I am your ShopEZ AI Personal Shopping Stylist. I can help you find products in our Men, Women, and Laptops sections, suggest outfit matches, or explain our dress color options. What are you shopping for today?";
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
