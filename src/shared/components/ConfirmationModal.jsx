import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle, FiLoader, FiX } from 'react-icons/fi';

const TONE_STYLES = {
  danger: {
    badge: 'bg-rose-100 text-rose-600',
    confirmButton: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-400',
  },
  primary: {
    badge: 'bg-blue-100 text-blue-600',
    confirmButton: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
  },
};

const ConfirmationModal = ({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  tone = 'danger',
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const styles = TONE_STYLES[tone] || TONE_STYLES.danger;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${styles.badge}`}>
              <FiAlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="confirmation-modal-title" className="text-lg font-bold text-slate-900">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles.confirmButton}`}
          >
            {isLoading ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
            <span>{isLoading ? 'Working...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
