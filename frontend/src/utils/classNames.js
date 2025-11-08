/**
 * Conditionally join class names together
 * @param  {...(string|boolean|null|undefined)} classes 
 * @returns {string}
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create class names from an object where keys are class names and values are booleans
 * @param {Object.<string, boolean>} classes
 * @returns {string}
 */
export function createClassNames(classes) {
  return Object.entries(classes)
    .filter(([_, value]) => Boolean(value))
    .map(([className]) => className)
    .join(' ');
}