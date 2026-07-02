import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductsState {
  products: Product[];
  categories: string[];
  brands: string[];
  selectedProduct: Product | null;
  reviews: ProductReview[];
  similar: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  brands: [],
  selectedProduct: null,
  reviews: [],
  similar: [],
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchMetaSuccess: (state, action: PayloadAction<{ categories: string[]; brands: string[] }>) => {
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
    },
    fetchDetailSuccess: (state, action: PayloadAction<{ product: Product; reviews: ProductReview[]; similar: Product[] }>) => {
      state.loading = false;
      state.selectedProduct = action.payload.product;
      state.reviews = action.payload.reviews;
      state.similar = action.payload.similar;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addReviewLocal: (state, action: PayloadAction<ProductReview>) => {
      state.reviews.unshift(action.payload);
      if (state.selectedProduct) {
        state.selectedProduct.reviewsCount += 1;
        // Recalculate average rating locally
        const total = state.reviews.reduce((sum, r) => sum + r.rating, 0);
        state.selectedProduct.rating = Math.round((total / state.reviews.length) * 10) / 10;
      }
    }
  }
});

export const { fetchStart, fetchProductsSuccess, fetchMetaSuccess, fetchDetailSuccess, fetchFailure, addReviewLocal } = productSlice.actions;
export default productSlice.reducer;
