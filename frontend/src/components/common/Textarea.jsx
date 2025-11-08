import React from 'react';
import PropTypes from 'prop-types';

const Textarea = React.forwardRef(({
  label,
  name,
  error,
  required = false,
  className = '',
  helperText,
  rows = 4,
  ...props
}, ref) => {
  const textareaClasses = `
    block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 
    ring-inset ${error ? 'ring-red-300' : 'ring-gray-300'} 
    placeholder:text-gray-400 
    focus:ring-2 focus:ring-inset ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
    sm:text-sm sm:leading-6
    ${error ? 'text-red-900' : ''}
    ${className}
  `;

  return (
    <div>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="mt-2">
        <textarea
          ref={ref}
          name={name}
          id={name}
          rows={rows}
          className={textareaClasses}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-description` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500" id={`${name}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  helperText: PropTypes.string,
  rows: PropTypes.number
};

export default Textarea;