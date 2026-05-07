import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import useCartStore from '../store/useCartStore';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const getCleanImages = (images) => {
    if (!images) return [];
    return images.map(img => typeof img === 'string' ? img.replace(/["\[\]]/g, '') : img);
  };

  const getCategoryName = (category) => {
    if (!category) return 'General';
    const coreNames = {
      1: 'Clothes',
      2: 'Electronics',
      3: 'Furniture',
      4: 'Shoes',
      5: 'Miscellaneous'
    };
    return coreNames[category.id] || category.name;
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '8rem 2rem'}}>
      <div className="spinner" style={{margin: '0 auto 1rem'}}></div>
      <p>Loading product details...</p>
    </div>;
  }

  if (!product) {
    return <div style={{textAlign: 'center', padding: '8rem 2rem'}}>
      <h2>Product not found</h2>
      <button className="btn-primary" onClick={() => navigate('/products')} style={{marginTop: '1rem'}}>
        Back to Shop
      </button>
    </div>;
  }

  const images = getCleanImages(product.images);

  return (
    <div className="product-detail-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="product-detail-container glass">
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={images[activeImage] || 'https://via.placeholder.com/600?text=No+Image'} 
              alt={product.title} 
              className="main-image"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Error' }}
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`${product.title} thumbnail ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-detail">
          <div className="product-category-badge">{getCategoryName(product.category)}</div>
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">${product.price}</p>
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="detail-action-bar">
            <button className="btn-primary detail-add-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
