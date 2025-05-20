import React from 'react';

export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="yes-btn" onClick={onConfirm}>Yes</button>
          <button className="no-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}
