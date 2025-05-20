// src/components/Toast.jsx
import React, { useEffect } from 'react';

const AuthToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#28a745' : '#dc3545';

  return (
    <div style={{ ...styles.toast, backgroundColor: bgColor }}>
      {message}
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    color: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
};

export default AuthToast;
