import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

import Home from './pages/Home'
import Layout from './pages/Layout'
import MovieCategories from './pages/movies/MovieCategories'
import MovieList from './pages/movies/MovieList';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/categories' element={<MovieCategories/>}></Route>
                <Route path="/categories/:type/:id" element={<MovieList/>} /> {/* 동적 라우트 */}
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
