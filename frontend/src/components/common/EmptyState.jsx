import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/classNames';

const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
  className = ''
}) => {
  return (
    <div className={classNames('text-center', className)}>
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400">
          <Icon className="h-full w-full" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  action: PropTypes.node,
  className: PropTypes.string
};

export default EmptyState;