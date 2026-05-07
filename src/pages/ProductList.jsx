import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import useCartStore from '../store/useCartStore';
import useNotificationStore from '../store/useNotificationStore';
import { Search, Filter } from 'lucide-react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCartStore();
  const { showNotification } = useNotificationStore();
  const searchInputRef = useRef(null);

  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
  });

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Karena API publik ini sering diubah namanya oleh developer lain (contoh: ID 1 diubah jadi "Test QA"),
    // kita akan "mengunci" paksa daftar kategori ke 5 kategori bawaan resmi dari sistem aslinya.
    const defaultCategories = [
      { id: 1, name: 'Clothes' },
      { id: 2, name: 'Electronics' },
      { id: 3, name: 'Furniture' },
      { id: 4, name: 'Shoes' },
      { id: 5, name: 'Miscellaneous' }
    ];
    setCategories(defaultCategories);
  }, []);

  // Live Search with Debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(false, filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.title, filters.categoryId, filters.price_min, filters.price_max]);

  const fetchProducts = async (append = false, currentFilters = filters) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const currentOffset = append ? offset + LIMIT : 0;
      
      const params = {
        limit: LIMIT,
        offset: currentOffset,
      };
      
      if (currentFilters.title) params.title = currentFilters.title;
      if (currentFilters.price_min) params.price_min = currentFilters.price_min;
      if (currentFilters.price_max) params.price_max = currentFilters.price_max;
      if (currentFilters.categoryId) params.categoryId = currentFilters.categoryId;

      const data = await getProducts(params);
      
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
      }
      
      setOffset(currentOffset);
      setHasMore(data.length === LIMIT); 
      
      const newParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });
      setSearchParams(newParams);

    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    showNotification(`${product.title} added to cart!`, 'success');
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/300?text=No+Image';
    const url = images[0];
    if (typeof url === 'string') {
        return url.replace(/["\[\]]/g, '');
    }
    return url;
  }

  return (
    <div className="product-list-page animate-fade-in">
      {/* Filter Section */}
      <div className="filters-section glass">
        <div className="search-bar">
          <input 
            ref={searchInputRef}
            type="text" 
            name="title"
            placeholder="Search products..." 
            value={filters.title}
            onChange={handleFilterChange}
          />
          <button className="search-btn">
            <Search size={20} />
          </button>
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} />
          </button>
        </div>

        {showFilters && (
          <div className="advanced-filters animate-fade-in">
            <div className="filter-group">
              <label>Category</label>
              <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price ($)</label>
              <input type="number" name="price_min" value={filters.price_min} onChange={handleFilterChange} min="0" />
            </div>
            <div className="filter-group">
              <label>Max Price ($)</label>
              <input type="number" name="price_max" value={filters.price_max} onChange={handleFilterChange} min="0" />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>Loading products...</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem'}}>No products found matching your criteria.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="product-card glass">
                  <div className="product-image-container">
                    <img 
                      src={getImageUrl(product.images)} 
                      alt={product.title} 
                      className="product-image"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Error' }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">${product.price}</p>
                    <button 
                      className="btn-primary add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore && products.length > 0 && (
            <div className="load-more-container">
              <button 
                className="btn-outline load-more-btn" 
                onClick={() => fetchProducts(true)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
