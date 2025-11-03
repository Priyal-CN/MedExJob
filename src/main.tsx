import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming your main App component is in App.tsx
import './index.css'; // Your global styles
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);