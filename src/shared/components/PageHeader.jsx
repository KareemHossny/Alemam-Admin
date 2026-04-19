import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PageHeader = ({
  title,
  description,
  icon: Icon,
  backTo,
  backLabel = 'Back',
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        {backTo ? (
          <Link
            to={backTo}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-gray-100 sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label={backLabel}
          >
            <FiArrowLeft className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
          </Link>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">{title}</h1>
          {description ? (
            <p className="text-sm text-gray-600 sm:text-base">{description}</p>
          ) : null}
        </div>
      </div>

      {Icon ? (
        <div className="flex h-10 w-10 self-end rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sm:h-12 sm:w-12 sm:self-auto sm:rounded-2xl">
          <Icon className="m-auto h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
