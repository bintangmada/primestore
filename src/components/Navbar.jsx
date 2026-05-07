import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PRIME</span>
          <span className="logo-accent">STORE</span>
        </Link>
        
        {/* Desktop Links (Hidden on Mobile) */}
        <div className="navbar-links desktop-only">
          <Link to="/products" className="nav-link">Shop</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/products" className="icon-btn" aria-label="Search">
            <Search size={22} />
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} className="icon-btn desktop-only" aria-label="Account">
            {isAuthenticated && user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="nav-avatar" 
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
                }}
              />
            ) : (
              <User size={22} />
            )}
          </Link>
          <Link to="/cart" className="icon-btn cart-btn desktop-only" aria-label="Cart">
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
