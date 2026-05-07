import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Kita gunakan kategori bawaan yang bersih agar tidak kena spam dari API publik
  const categories = [
    { id: 1, name: 'Clothes', image: 'https://i.imgur.com/QkIa5tT.jpeg' },
    { id: 2, name: 'Electronics', image: 'https://i.imgur.com/ZANVnHE.jpeg' },
    { id: 3, name: 'Furniture', image: 'https://i.imgur.com/Qphac99.jpeg' },
    { id: 4, name: 'Shoes', image: 'https://i.imgur.com/qNOjJje.jpeg' },
    { id: 5, name: 'Miscellaneous', image: 'https://i.imgur.com/BG8J0Fj.jpg' }
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section glass">
        <div className="hero-content">
          <h1 className="hero-title">Discover the Extraordinary</h1>
          <p className="hero-subtitle">
            Premium goods for your modern lifestyle. Handpicked quality delivered to your door.
          </p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
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
              className="category-card glass"
            >
              <img src={category.image} alt={category.name} className="category-image" />
              <div className="category-overlay">
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section placeholder */}
      <section className="featured-section" style={{marginTop: '3rem'}}>
        <h2 className="section-title">Featured Collections</h2>
        <div className="glass" style={{padding: '2rem', borderRadius: '20px', textAlign: 'center'}}>
          <p style={{color: 'var(--text-secondary)'}}>Summer Collection 2026 is coming soon!</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
