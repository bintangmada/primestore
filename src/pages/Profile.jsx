import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LogOut, User, Mail, ShieldCheck } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page animate-fade-in">
      <header className="page-header">
        <h1 className="section-title">My Profile</h1>
      </header>

      <div className="profile-container glass">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <span className="profile-role-badge">{user.role}</span>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={20} />
            <div className="detail-info">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="detail-item">
            <ShieldCheck size={20} />
            <div className="detail-info">
              <label>Account ID</label>
              <p>#{user.id}</p>
            </div>
          </div>
        </div>

        <button className="btn-outline logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
