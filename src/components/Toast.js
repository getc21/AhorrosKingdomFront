import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ id, message, type = 'info', onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300);
    };

    const timer = setTimeout(handleClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyles =
    'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm transform transition-all duration-300';

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const iconMap = {
    success: <CheckCircle size={20} className="flex-shrink-0" />,
    error: <AlertCircle size={20} className="flex-shrink-0" />,
    warning: <AlertTriangle size={20} className="flex-shrink-0" />,
    info: <Info size={20} className="flex-shrink-0" />,
  };

  return (
    <div
      className={`${baseStyles} ${typeStyles[type]} ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      {iconMap[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="ml-2 flex-shrink-0 hover:opacity-75 transition"
        aria-label="Cerrar notificación"
      >
        <X size={18} />
      </button>
    </div>
  );
}
