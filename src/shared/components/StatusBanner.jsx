import React from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const VARIANT_STYLES = {
  error: {
    container: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: 'text-rose-600',
    title: 'Error',
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: 'text-emerald-600',
    title: 'Success',
  },
};

const StatusBanner = ({
  message,
  variant = 'error',
  className = '',
}) => {
  if (!message) {
    return null;
  }

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.error;
  const Icon = variant === 'success' ? FiCheckCircle : FiAlertCircle;

  return (
    <div className={`rounded-xl border p-3 sm:rounded-2xl sm:p-4 ${styles.container} ${className}`.trim()}>
      <div className="flex items-start gap-2 sm:gap-3">
        <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 ${styles.icon}`} />
        <div className="flex-1">
          <span className="block text-sm font-semibold sm:text-base">{styles.title}</span>
          <p className="mt-1 text-xs sm:text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
