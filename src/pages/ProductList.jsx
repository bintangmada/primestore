import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import useCartStore from '../store/useCartStore';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(30, 0);
        let filteredData = data;
        if (categoryId) {
          filteredData = data.filter(p => p.category.id === parseInt(categoryId));
        }
        setProducts(filteredData);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/300?text=No+Image';
    // Handle Platzi API array stringification issue
    const url = images[0];
    if (typeof url === 'string') {
        return url.replace(/["\[\]]/g, '');
    }
    return url;
  }

  return (
    <div className="product-list-page animate-fade-in">
      <header className="page-header">
        <h1 className="section-title">All Products</h1>
        <p style={{color: 'var(--text-secondary)', textAlign: 'center'}}>Find the best items here.</p>
      </header>

      {loading ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>Loading products...</div>
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
    </div>
  );
};

export default ProductList;
