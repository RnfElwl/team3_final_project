import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './App.css';

import Home from './pages/Home';
import Layout from './pages/Layout';
import MovieCategories from './pages/movies/MovieCategories';
import ChatList from './pages/chat/ChatList.js';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/chat' element={<ChatList/>}></Route>
                <Route path='/categories' element={<MovieCategories/>}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
