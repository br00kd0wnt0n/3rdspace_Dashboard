import React from 'react';
import { createRoot } from 'react-dom/client';
import ThirdSpaceDashboard from './Dashboard';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThirdSpaceDashboard />
  </React.StrictMode>
);
