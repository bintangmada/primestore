import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import './BottomNav.css';

const BottomNav = () => {
  const { cart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/products" className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <LayoutGrid size={24} />
        <span>Shop</span>
      </NavLink>
      <NavLink to="/cart" className={({isActive}) => `bottom-nav-item cart-nav-item ${isActive ? 'active' : ''}`}>
        <div className="cart-icon-wrapper">
          <ShoppingCart size={24} />
          {itemCount > 0 && <span className="cart-badge-bottom">{itemCount}</span>}
        </div>
        <span>Cart</span>
      </NavLink>
      <NavLink to={isAuthenticated ? "/profile" : "/login"} className={({isActive}) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        {isAuthenticated && user?.avatar ? (
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="bottom-nav-avatar" 
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
            }}
          />
        ) : (
          <User size={24} />
        )}
        <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
