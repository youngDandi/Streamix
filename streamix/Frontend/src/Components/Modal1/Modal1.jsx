import React from 'react';
import './Modal1.css';

export default function Modal1({ open, onClose, children }) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`backdrop ${open ? 'visible' : 'invisible'}`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal ${open ? 'scale-100' : 'scale-125'}`}
      >
        <button onClick={onClose} className="close-btn">
          X
        </button>
        {children}
      </div>
    </div>
  );
}
