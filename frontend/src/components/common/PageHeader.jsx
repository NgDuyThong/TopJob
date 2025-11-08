import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/classNames';

const PageHeader = ({
  title,
  description,
  action,
  breadcrumbs,
  className = ''
}) => {
  return (
    <div className={classNames('bg-white shadow', className)}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.name}>
                  {index > 0 && <span>/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-gray-700">
                      {item.name}
                    </a>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        )}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="mt-4 flex md:ml-4 md:mt-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ),
  className: PropTypes.string
};

export default PageHeader;