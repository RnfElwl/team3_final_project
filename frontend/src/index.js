import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route } from 'react-router-dom';
import 'pretendard/dist/web/static/pretendard.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   // <React.StrictMode>
      <App/>
   // </React.StrictMode>
);

