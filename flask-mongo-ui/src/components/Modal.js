import React from 'react';
import '../css/Modal.css';

const Modal = ({ show, message, type, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className={`modal-message ${type}`}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default Modal;