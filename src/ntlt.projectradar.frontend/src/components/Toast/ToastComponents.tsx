'use client';

import { useEffect, useState } from 'react';
import { Toast, ToastType, useToast } from '../../contexts/ToastContext';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getIconColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg border p-4 shadow-lg max-w-sm w-full ${getToastStyles(toast.type)}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColor(toast.type)} mr-3`}>
            <span className="text-lg">{getIcon(toast.type)}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">{toast.title}</h4>
            {toast.message && (
              <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            )}
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`text-sm font-medium underline hover:no-underline focus:outline-none ${
                    toast.type === 'success' ? 'text-green-700' :
                    toast.type === 'error' ? 'text-red-700' :
                    toast.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 ml-3 text-neutral-400 hover:text-neutral-600 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

// Demo component for testing toasts
export function ToastDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border border-neutral-200">
      <h3 className="text-lg font-medium text-neutral-900">Toast Notifications Demo</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => showSuccess('Upload Complete', 'Your files have been processed successfully')}
          className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Success Toast
        </button>
        
        <button
          onClick={() => showError('Upload Failed', 'There was an error processing your files')}
          className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Error Toast
        </button>
        
        <button
          onClick={() => showWarning('Storage Almost Full', 'You have used 90% of your storage quota')}
          className="px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Warning Toast
        </button>
        
        <button
          onClick={() => showInfo('New Feature Available', 'Check out the new search filters', {
            action: {
              label: 'Learn More',
              onClick: () => alert('Learn more clicked!')
            }
          })}
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Info Toast with Action
        </button>
      </div>
    </div>
  );
}
