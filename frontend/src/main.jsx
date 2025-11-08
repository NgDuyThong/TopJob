import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Helpful debug logs to surface mount/runtime errors in the browser console
console.log('main.jsx loaded');

try {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('React mount failed: <div id="root"> not found in DOM');
  } else if (typeof createRoot !== 'function') {
    console.error('React mount failed: createRoot is not a function — check react-dom version');
  } else {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
} catch (err) {
  // Surface any unexpected runtime errors during mount
  // This should appear in the browser console when the page is reloaded
  console.error('Error mounting React app:', err);
}
