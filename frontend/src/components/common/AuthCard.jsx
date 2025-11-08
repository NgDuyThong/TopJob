import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          {children}
          {footer && (
            <div className="mt-6">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

AuthCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node
};

export default AuthCard;