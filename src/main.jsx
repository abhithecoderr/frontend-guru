import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global styles (order matters)
import './styles/index.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/canvas.css';
import './styles/components.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
