import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';

import Home from './pages/Home';
import Layout from './pages/Layout';
//import MovieCategories from './pages/movies/MovieCategories.js';
//import MovieList from './pages/movies/MovieList.js';
import ChatList from './pages/chat/ChatList.js';
import ChatTest from './pages/chat/ChatTest.js';
import CommunityList from './pages/community/CommunityList.js';
import CommunityWrite from './pages/community/CommunityWrite.js';
import CommunityView from './pages/community/CommunityView.js';
import CommunityEdit from './pages/community/CommunityEdit.js';

//import MovieView from './pages/movies/MovieView.js';

// import MovieView from './pages/movies/MovieView.js';

import AdminTest from './pages/admin/AdminTest'
import QNA from './pages/qna/QnA'      
import MyPage from './pages/mypage/MyPage';
import LoginPage from './pages/mypage/LoginPage.js';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/chat' element={<ChatList/>}></Route>
                <Route path='/chat/:chatlist_url' element={<ChatTest/>}></Route>

                {/* <Route path='/categories' element={<MovieCategories/>}></Route> */}
                {/* <Route path="/categories/:type/:id" element={<MovieList/>} /> 동적 라우트 */}

                <Route path='/categories' element={<MovieCategories/>}></Route>
                <Route path="/categories/:type/:id" element={<MovieList/>} /> {/* 동적 라우트 */}

                {/* <Route path="/categories/:type/:id/view" element={<MovieView />} /> */}
                <Route path='/community' element={<CommunityList/>}></Route>
                <Route path='/community/communityWrtie' element={<CommunityWrite/>}></Route>
                <Route path='/community/communityView' element={<CommunityView/>}></Route>
                <Route path='/community/communityEdit' element={<CommunityEdit/>}></Route>
                <Route path='/adminTest/' element={<AdminTest/>}/>
                <Route path='/qna' element={<QNA/>}></Route>
                <Route path='/mypage' element={<MyPage/>}/>
                <Route path='/loginpage' element={<LoginPage/>}/>

            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
