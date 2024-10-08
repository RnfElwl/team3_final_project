import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './pages/Home';
import Layout from './pages/Layout';
import MovieCategories from './pages/movies/MovieCategories.js';
import MovieList from './pages/movies/MovieList.js';
import MovieView from './pages/movies/MovieView.js';
import ChatList from './pages/chat/ChatList.js';
import Chatting from './pages/chat/Chatting.js';
import CommunityList from './pages/community/CommunityList.js';
import CommunityWrite from './pages/community/CommunityWrite.js';
import CommunityView from './pages/community/CommunityView.js';
import CommunityEdit from './pages/community/CommunityEdit.js';
import Admin from './pages/admin/Admin.js'
import QNA from './pages/qna/QnA'
import QNAView from './pages/qna/QnAView.js'
import MvShopping from './pages/shopping/MvShopping.js'    
import MyPage from './pages/mypage/MyPage';
import LoginPage from './pages/mypage/LoginPage.js';
import QNAWrite from './pages/qna/QnAWrite.js'
import QNAEdit from './pages/qna/QnAEdit.js' 
import Recommend from './pages/recommend/Recommend.js';
import EditInfo from './pages/mypage/EditInfo.js';
import Signup from './pages/mypage/Signup.js'; 

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/chat' element={<ChatList/>}></Route>
                <Route path='/chat/:chatlist_url' element={<Chatting/>}></Route>

                <Route path='/categories' element={<MovieCategories/>}></Route>
                
                <Route path="/categories/:type/:id" element={<MovieList/>} /> {/* 동적 라우트 */}
                <Route path="/movies/view/:movieCode" element={<MovieView />} />
                <Route path='/community' element={<CommunityList/>}></Route>
                <Route path='/community/communityWrite' element={<CommunityWrite/>}></Route>
                <Route path='/community/communityView/:community_no' element={<CommunityView/>}></Route>
                <Route path='/community/communityEdit/:community_no' element={<CommunityEdit/>}></Route>
                <Route path='/admin/' element={<Admin/>}/>
                <Route path='/qna' element={<QNA/>}></Route>
                <Route path='/qna/view/:qna_no' element={<QNAView/>}/>
                <Route path='/qna/write' element={<QNAWrite/>}/> 
                <Route path='/qna/edit/:qna_no' element= {<QNAEdit/>}/>
                <Route path='/shop/' element={<MvShopping/>}/>
                <Route path='/mypage' element={<MyPage/>}/>
                <Route path='/signin' element={<LoginPage/>}/>
                <Route path = '/signup' element = {<Signup/>}/>
                <Route path='/recommend' element={<Recommend/>}/>
                <Route path = '/mypage/edit' element={<EditInfo/>}/>

            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
