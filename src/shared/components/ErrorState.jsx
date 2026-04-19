import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import SurfaceCard from './SurfaceCard';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this section right now.',
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) => {
  return (
    <SurfaceCard className={`border-rose-200/70 bg-rose-50/80 ${className}`.trim()}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <FiAlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-950">{title}</h3>
            <p className="mt-1 text-sm text-rose-800 sm:text-base">{message}</p>
          </div>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>{retryLabel}</span>
          </button>
        ) : null}
      </div>
    </SurfaceCard>
  );
};

export default ErrorState;
