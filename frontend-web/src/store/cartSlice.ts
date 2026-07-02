import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  category: string;
}

interface CouponInfo {
  code: string;
  percent: number;
  minSpent: number;
}

interface CartState {
  items: CartItem[];
  coupon: CouponInfo | null;
  shippingMethod: 'standard' | 'express';
  taxRate: number; // 0.18 for luxury VAT/GST
  giftWrap: boolean;
}

const savedItems = localStorage.getItem('shopez_cart');
let initialItems: CartItem[] = [];
try {
  if (savedItems) initialItems = JSON.parse(savedItems);
} catch (e) {
  localStorage.removeItem('shopez_cart');
}

const initialState: CartState = {
  items: initialItems,
  coupon: null,
  shippingMethod: 'standard',
  taxRate: 0.18,
  giftWrap: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, size, color, quantity } = action.payload;
      const exist = state.items.find(
        item => item.product === product && item.size === size && item.color === color
      );

      if (exist) {
        exist.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('shopez_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<{ product: string; size: string; color: string }>) => {
      const { product, size, color } = action.payload;
      state.items = state.items.filter(
        item => !(item.product === product && item.size === size && item.color === color)
      );
      localStorage.setItem('shopez_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ product: string; size: string; color: string; quantity: number }>) => {
      const { product, size, color, quantity } = action.payload;
      const exist = state.items.find(
        item => item.product === product && item.size === size && item.color === color
      );
      if (exist) {
        exist.quantity = quantity;
        if (exist.quantity <= 0) {
          state.items = state.items.filter(
            item => !(item.product === product && item.size === size && item.color === color)
          );
        }
      }
      localStorage.setItem('shopez_cart', JSON.stringify(state.items));
    },
    applyCoupon: (state, action: PayloadAction<CouponInfo>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    setShippingMethod: (state, action: PayloadAction<'standard' | 'express'>) => {
      state.shippingMethod = action.payload;
    },
    toggleGiftWrap: (state) => {
      state.giftWrap = !state.giftWrap;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.giftWrap = false;
      localStorage.removeItem('shopez_cart');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, removeCoupon, setShippingMethod, clearCart, toggleGiftWrap } = cartSlice.actions;
export default cartSlice.reducer;
export const getCartTotals = (state: CartState) => {
  const subtotal = state.items.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (state.coupon && subtotal >= state.coupon.minSpent) {
    discountAmount = subtotal * (state.coupon.percent / 100);
  }

  const netSubtotal = subtotal - discountAmount;
  const tax = netSubtotal * state.taxRate;
  
  // Free shipping above $200
  let shipping = 0;
  if (state.items.length > 0 && subtotal < 200) {
    shipping = state.shippingMethod === 'express' ? 25 : 15;
  }

  const giftWrapCost = state.giftWrap ? 5.00 : 0.00;
  const grandTotal = netSubtotal + tax + shipping + giftWrapCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping,
    giftWrapCost,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
};
