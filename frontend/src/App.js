import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './App.css';

import Home from './pages/Home'
import Layout from './pages/Layout'
function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
