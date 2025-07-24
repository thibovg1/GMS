// src/components/Modal.js
import React from 'react';

// Custom Modal Component (instead of alert/confirm)
const Modal = ({ show, title, message, onClose, onConfirm, type = 'info', children }) => {
    if (!show) return null;

    const bgColor = type === 'error' ? 'bg-red-800' : type === 'success' ? 'bg-green-800' : 'bg-blue-800';
    const textColor = 'text-white';
    const borderColor = type === 'error' ? 'border-red-600' : type === 'success' ? 'border-green-600' : 'border-blue-600';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className={`bg-gray-800 rounded-lg shadow-xl border ${borderColor} w-full max-w-sm mx-auto p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{title}</h3>
                <p className="text-gray-200 mb-6">{message}</p>
                {children} {/* Render children inside the modal content */}
                <div className="flex justify-end space-x-3 mt-4">
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Bevestigen
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                        Sluiten
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;