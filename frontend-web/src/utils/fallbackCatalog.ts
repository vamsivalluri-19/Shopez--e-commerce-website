export interface FallbackCatalogProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inventory: number;
  rating: number;
  reviewsCount: number;
}

export const fallbackCatalogProducts: FallbackCatalogProduct[] = [
  {
    _id: 'fallback-women-coat',
    name: 'Cashmere Trench Coat',
    description: 'Double-breasted trench coat tailored in soft organic cashmere.',
    price: 240,
    discount: 10,
    brand: 'Zara',
    category: 'Women',
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Oat', 'Black', 'Camel'],
    inventory: 8,
    rating: 4.8,
    reviewsCount: 28
  },
  {
    _id: 'fallback-men-hoodie',
    name: 'Heavyweight Fleece Hoodie',
    description: 'Thick 450GSM loopback cotton hoodie with double hood.',
    price: 120,
    discount: 0,
    brand: 'Nike',
    category: 'Men',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stone', 'Navy', 'Black'],
    inventory: 12,
    rating: 4.7,
    reviewsCount: 34
  },
  {
    _id: 'fallback-footwear-sneaker',
    name: 'AeroKnit Cushioned Trainers',
    description: 'High-performance running shoe with breathable knit upper.',
    price: 165,
    discount: 5,
    brand: 'Adidas',
    category: 'Footwear',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10'],
    colors: ['White', 'Black'],
    inventory: 15,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    _id: 'fallback-accessories-watch',
    name: 'Submariner Yacht Chronograph Watch',
    description: 'Luxury timepiece detailed with unidirectional rotating bezel.',
    price: 980,
    discount: 0,
    brand: 'Rolex',
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['One Size'],
    colors: ['Silver', 'Gold'],
    inventory: 4,
    rating: 5,
    reviewsCount: 19
  }
];

export function getFallbackProductById(productId: string) {
  return fallbackCatalogProducts.find(product => product._id === productId) || null;
}