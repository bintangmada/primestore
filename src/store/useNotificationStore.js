import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  message: '',
  type: 'info', // 'success' | 'error' | 'info' | 'warning'
  isVisible: false,

  showNotification: (message, type = 'info') => {
    set({ message, type, isVisible: true });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },

  hideNotification: () => set({ isVisible: false }),
}));

export default useNotificationStore;
