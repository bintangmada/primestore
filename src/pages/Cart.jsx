import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showNotification('You need to login first to proceed to checkout!', 'warning');
      navigate('/login');
    } else {
      showNotification('Checkout successful! Thank you for shopping.', 'success');
      clearCart();
    }
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    const url = images[0];
    return typeof url === 'string' ? url.replace(/["\[\]]/g, '') : url;
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty animate-fade-in">
        <ShoppingCart size={64} color="var(--text-secondary)" style={{marginBottom: '1rem'}} />
        <h2>Your cart is empty</h2>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <h1 className="section-title" style={{textAlign: 'left', marginBottom: '2rem'}}>Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items glass">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={getImageUrl(item.images)} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <Link to={`/products/${item.id}`} className="cart-item-title">{item.title}</Link>
                <div className="cart-item-price">${item.price}</div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                </div>
                <div className="cart-item-subtotal">${item.price * item.quantity}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <div className="cart-actions-bottom">
            <button className="btn-outline" onClick={clearCart}>Clear Cart</button>
            <Link to="/products" className="btn-outline"><ArrowLeft size={16} /> Continue Shopping</Link>
          </div>
        </div>

        <div className="cart-summary glass">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
          <button className="btn-primary checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
