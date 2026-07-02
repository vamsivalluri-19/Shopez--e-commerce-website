import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProductsSuccess, fetchMetaSuccess, fetchFailure } from './store/productSlice';
import { logout } from './store/authSlice';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import axios from 'axios';

export default function App() {
  const dispatch = useDispatch();
  
  // Custom router state
  const [activePage, setActivePage] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedBrandName, setSelectedBrandName] = useState<string>('');

  // Initialize store with product listing on start
  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        const prodRes = await axios.get('/api/products');
        dispatch(fetchProductsSuccess(prodRes.data));

        const metaRes = await axios.get('/api/products/categories');
        dispatch(fetchMetaSuccess(metaRes.data));
      } catch (err: any) {
        dispatch(fetchFailure(err.message));
      }
    };
    bootstrapApp();
  }, [dispatch, activePage]);

  // Axios response interceptor to handle token expiry / deletion
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  // Page Routing selector
  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return (
          <Landing 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
            setSelectedCategoryName={setSelectedCategoryName}
            setSelectedBrandName={setSelectedBrandName}
          />
        );
      case 'catalog':
        return (
          <Catalog 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
            initialCategory={selectedCategoryName}
            setInitialCategory={setSelectedCategoryName}
            initialBrand={selectedBrandName}
            setInitialBrand={setSelectedBrandName}
          />
        );
      case 'product-details':
        return selectedProductId ? (
          <ProductDetails 
            productId={selectedProductId}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
          />
        ) : (
          <Catalog 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
      case 'checkout':
        return <Checkout setActivePage={setActivePage} />;
      case 'profile':
        return (
          <Profile 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
      case 'admin':
        return <Admin setActivePage={setActivePage} />;
      default:
        return (
          <Landing 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={setActivePage} 
      setSelectedProductId={setSelectedProductId}
      setSelectedCategoryName={setSelectedCategoryName}
    >
      {renderActivePage()}
    </Layout>
  );
}
