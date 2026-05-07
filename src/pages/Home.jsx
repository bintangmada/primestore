import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Filter out empty or duplicate categories
        setCategories(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <section className="hero-section glass">
        <div className="hero-content">
          <h1 className="hero-title">Discover the Extraordinary</h1>
          <p className="hero-subtitle">Premium goods for your modern lifestyle. Handpicked quality delivered to your door.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>Loading categories...</div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <Link to={`/products?category=${category.id}`} key={category.id} className="category-card glass">
                <img src={category.image} alt={category.name} className="category-image" />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
