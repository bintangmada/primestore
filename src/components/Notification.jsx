import React from 'react';
import useNotificationStore from '../store/useNotificationStore';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import './Notification.css';

const Notification = () => {
  const { message, type, isVisible, hideNotification } = useNotificationStore();

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className={`notification-overlay animate-fade-in`} onClick={hideNotification}>
      <div className={`notification-toast glass ${type}`} onClick={e => e.stopPropagation()}>
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-content">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
