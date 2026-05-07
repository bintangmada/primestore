import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import './Home.css';

const Home = () => {
  const categories = [
    { id: 1, name: 'Clothes', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400' },
    { id: 2, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400' },
    { id: 3, name: 'Furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400' },
    { id: 4, name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400' },
    { id: 5, name: 'Miscellaneous', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400' }
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge glass">
            <Sparkles size={14} className="icon-gold" />
            <span>New Season Collection 2026</span>
          </div>
          <h1 className="hero-title">Elevate Your Lifestyle</h1>
          <p className="hero-subtitle">
            Experience the perfect blend of luxury and functionality with our handpicked premium collections.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary hero-btn">
              Explore Shop
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges">
        <div className="badge-item">
          <Zap size={20} className="accent-color" />
          <span>Fast Delivery</span>
        </div>
        <div className="badge-item">
          <ShieldCheck size={20} className="accent-color" />
          <span>Secure Payment</span>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid no-scrollbar">
          {categories.map((category) => (
            <Link 
              to={`/products?categoryId=${category.id}`} 
              key={category.id} 
              className="category-card"
            >
              <img src={category.image} alt={category.name} className="category-image" />
              <div className="category-overlay">
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="featured-section">
        <div className="featured-card new-arrival glass">
          <div className="featured-info">
            <h2 className="section-title" style={{border: 'none', padding: 0}}>Special Offer</h2>
            <h3>Up to 40% Off</h3>
            <p>On selected premium electronics. Limited time only.</p>
            <Link to="/products?categoryId=2" className="btn-outline" style={{marginTop: '1rem', width: 'fit-content'}}>
              View Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
