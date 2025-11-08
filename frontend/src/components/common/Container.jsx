import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../utils/classNames';

const Container = ({ children, className = '', maxWidth = '7xl' }) => {
  return (
    <div className={classNames('mx-auto px-4 sm:px-6 lg:px-8', `max-w-${maxWidth}`, className)}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'])
};

export default Container;