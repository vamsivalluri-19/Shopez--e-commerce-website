import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone: string;
  addresses: UserAddress[];
  wishlist: string[];
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem('shopez_token');
const userStr = localStorage.getItem('shopez_user');
let parsedUser: UserProfile | null = null;
try {
  if (userStr) parsedUser = JSON.parse(userStr);
} catch (e) {
  localStorage.removeItem('shopez_user');
}

const initialState: AuthState = {
  token: token || null,
  user: parsedUser,
  isAuthenticated: !!token && !!parsedUser,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ token: string; user: UserProfile }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('shopez_token', action.payload.token);
      localStorage.setItem('shopez_user', JSON.stringify(action.payload.user));
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('shopez_token');
      localStorage.removeItem('shopez_user');
    },
    updateWishlist: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.wishlist = action.payload;
        localStorage.setItem('shopez_user', JSON.stringify(state.user));
      }
    },
    updateAddresses: (state, action: PayloadAction<UserAddress[]>) => {
      if (state.user) {
        state.user.addresses = action.payload;
        localStorage.setItem('shopez_user', JSON.stringify(state.user));
      }
    }
  }
});

export const { authStart, authSuccess, authFailure, logout, updateWishlist, updateAddresses } = authSlice.actions;
export default authSlice.reducer;
