import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Modal from '../components/Modal';
import { LogOut, User, Mail, ShieldCheck, Camera, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout, isAuthenticated, updateAvatar } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setNewAvatarUrl(''); // Clear URL input if file is selected
    }
  };

  const handleUpdateAvatar = async () => {
    setUpdating(true);
    try {
      let finalUrl = newAvatarUrl;

      // If file is selected, upload it first
      if (selectedFile) {
        const uploadResponse = await uploadFile(selectedFile);
        finalUrl = uploadResponse.location; // Platzi API returns URL in 'location'
      }

      if (!finalUrl) {
        alert('Silakan pilih file atau masukkan URL gambar.');
        setUpdating(false);
        return;
      }

      await updateAvatar(finalUrl);
      setShowAvatarModal(false);
      setNewAvatarUrl('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      alert('Gagal mengganti foto profil. Pastikan file/URL valid.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <header className="page-header">
        <h1 className="section-title">My Profile</h1>
      </header>

      <div className="profile-container glass">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="profile-avatar" 
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
              }}
            />
            <button className="edit-avatar-btn" onClick={() => setShowAvatarModal(true)}>
              <Camera size={16} />
            </button>
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

        <button className="btn-outline logout-btn" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Modal Edit Avatar */}
      <Modal 
        isOpen={showAvatarModal} 
        onClose={() => setShowAvatarModal(false)}
        title="Change Profile Picture"
        footer={
          <>
            <button className="btn-outline" onClick={() => setShowAvatarModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleUpdateAvatar} disabled={updating}>
              {updating ? 'Saving...' : 'Update Picture'}
            </button>
          </>
        }
      >
        <div className="avatar-edit-form">
          <div className="upload-options">
            <div className="upload-section">
              <label className="upload-label">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{display: 'none'}} 
                />
                <div className="upload-placeholder glass">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="avatar-preview" />
                  ) : (
                    <>
                      <Upload size={32} />
                      <span>Upload from Device</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="url-section">
              <label>Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={newAvatarUrl}
                onChange={(e) => {
                  setNewAvatarUrl(e.target.value);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="glass-input"
                style={{width: '100%', padding: '1rem'}}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out"
        footer={
          <>
            <button className="btn-outline" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            <button className="btn-primary" style={{background: '#ff4d4d'}} onClick={handleLogout}>Sign Out</button>
          </>
        }
      >
        <p>Are you sure you want to sign out of your account?</p>
      </Modal>
    </div>
  );
};

export default Profile;
