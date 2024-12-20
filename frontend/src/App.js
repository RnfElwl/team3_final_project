import React from 'react';
import { BrowserRouter, Route, Routes, Redirect, Navigate  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TokenValidator from './component/TokenValidator.js';
import ScrollToTop from './component/ScrollToTop.js';
import PrivateRoute from './pages/PrivateRoute.js';

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
import AdminQnaCon from './pages/admin/Admin_qnaCon.js'
import AdminQAns from './pages/admin/Admin_qnaAnsWrite.js'
import AdminComCon from './pages/admin/Admin_comCon.js'
import AdminMemCon from './pages/admin/Admin_memCon.js'
import AdminBanMemCon from './pages/admin/Admin_bannedMemCon.js';
import AdminBanEdit from './pages/admin/Admin_banEditWrite.js';
import AdminMovCon from './pages/admin/Admin_movieCon.js'
import AdminRepCon from './pages/admin/Admin_repCon.js'
import AdminRepAns from './pages/admin/Admin_repAnsWrite.js'
import AdminNociceCon from './pages/admin/Admin_noticeCon.js'
import AdminEventCon from './pages/admin/Admin_eventCon.js'
import QNA from './pages/qna/QnA'
import QNAView from './pages/qna/QnAView.js'   
import MyPage from './pages/mypage/MyPage';
import More from './pages/mypage/More.js' 
import LoginPage from './pages/mypage/LoginPage.js';
import QNAWrite from './pages/qna/QnAWrite.js'
import QNAEdit from './pages/qna/QnAEdit.js' 
import Recommend from './pages/recommend/Recommend.js';
import EditInfo from './pages/mypage/EditInfo.js';
import Signup from './pages/mypage/Signup.js'; 
import User from './pages/mypage/User.js';
import MyPost from './pages/mypage/MyPost.js';
import Find from './pages/mypage/Find.js';
import Success from './pages/mypage/Success.js';
import ResetPassword from './pages/mypage/ResetPassword.js';
import EventList from './pages/event/EventList.js';
import EventView from './pages/event/EventView.js';
import EventNoticeView from './pages/event/EventNoticeView.js';
import KakaoSignup from './pages/mypage/KakaoSignup.js'; 

function App() {
  return (
    <BrowserRouter>
      <TokenValidator>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='/' element={<Home/>}></Route>
                

                <Route path='/categories' element={<MovieCategories/>}></Route>
                
                <Route path="/categories/:type/:id" element={<MovieList/>} /> {/* 동적 라우트 */}
                <Route path="/movies/view/:movieCode" element={<MovieView />} />
                <Route path='/community' element={<CommunityList/>}></Route>
                <Route path='/community/communityView/:community_no' element={<CommunityView/>}></Route>
                {/* <Route path='/community/communityWrite' element={<CommunityWrite/>}></Route> */}
                {/* <Route path='/community/communityEdit/:community_no' element={<CommunityEdit/>}></Route> */}
                {/* <Route path='/admin' element={<Admin/>}/> */}
                {/* <Route path='/admin/qnaCon' element={<AdminQnaCon/>}/> */}
                {/* <Route path='/admin/adminQAns/:qna_no' element={<AdminQAns/>}/> */}
                {/* <Route path='/admin/comCon' element={<AdminComCon/>}/> */}
                {/* <Route path='/admin/memCon' element={<AdminMemCon/>}/> */}
                {/* <Route path='/admin/banMemCon' element={<AdminBanMemCon/>}/>
                <Route path='/admin/banEdit/:userid' element={<AdminBanEdit/>}/>
                <Route path='/admin/movCon' element={<AdminMovCon/>}/>
                <Route path='/admin/repCon' element={<AdminRepCon/>}/>
                <Route path='/admin/repAns/:no' element={<AdminRepAns/>}/>
                <Route path='/admin/noticeCon' element={<AdminNociceCon/>}/> */}
                {/* <Route path='/admin/eventCon' element={<AdminEventCon/>}/> */}
                <Route path='/qna' element={<QNA/>}></Route>
                <Route path='/qna/view/:qna_no' element={<QNAView/>}/>
                {/* <Route path='/qna/write' element={<QNAWrite/>}/> 
                <Route path='/qna/edit/:qna_no' element= {<QNAEdit/>}/> */}
                {/* <Route path='/mypage' element={<MyPage/>}/> */}
                <Route path='/signin' element={<LoginPage/>}/>
                <Route path = '/signup' element = {<Signup/>}/>
                <Route path='/recommend' element={<Recommend/>}/>
                {/* <Route path = '/mypage/edit' element={<EditInfo/>}/> */}
                {/* <Route path = "/mypage/:more" element={<More/>}/> */}
                <Route path ="/user/info/:usernick" element={<User/>}/>
                <Route path ="/user/info/" element={<User/>}/>
                {/* <Route path = "/mypage/mypost" element={<MyPost/>}/> */}
                <Route path ="/find/:type" element={<Find/>}/>
                <Route path ="/success" element={<Success/>}/>
                <Route path ="/reset-password" element={<ResetPassword/>}/>
                <Route path ="/event" element={<EventList/>}/>
                <Route path ="/event/:event_no" element={<EventView/>}/>
                <Route path ="/event/notice/:notice_no" element={<EventNoticeView/>}/>
                <Route path="/kakaosignup" element={<KakaoSignup />} />

            
              {/* USER 1차 체크 */}
              <Route element={<PrivateRoute requiredRole="USER" />}>
                <Route path='/chat' element={<ChatList/>}></Route>
                <Route path='/chatting/:chatlist_url' element={<Chatting/>}></Route>
                <Route path="/mypage" element={<MyPage />} />
                <Route path = '/mypage/edit' element={<EditInfo/>}/>
                <Route path = "/mypage/mypost" element={<MyPost/>}/>
                <Route path = "/mypage/:more" element={<More/>}/>
                <Route path='/qna/write' element={<QNAWrite/>}/> 
                <Route path='/qna/edit/:qna_no' element= {<QNAEdit/>}/>
                <Route path='/community/communityWrite' element={<CommunityWrite/>}></Route>
                <Route path='/community/communityEdit/:community_no' element={<CommunityEdit/>}></Route>
              </Route>

              {/* Admin 1차 체크 */}
              <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                <Route path="/admin" element={<Admin />} />
                <Route path='/admin/qnaCon' element={<AdminQnaCon/>}/>
                <Route path='/admin/adminQAns/:qna_no' element={<AdminQAns/>}/>
                <Route path='/admin/comCon' element={<AdminComCon/>}/>
                <Route path='/admin/memCon' element={<AdminMemCon/>}/>
                <Route path='/admin/banMemCon' element={<AdminBanMemCon/>}/>
                <Route path='/admin/banEdit/:userid' element={<AdminBanEdit/>}/>
                <Route path='/admin/movCon' element={<AdminMovCon/>}/>
                <Route path='/admin/repCon' element={<AdminRepCon/>}/>
                <Route path='/admin/repAns/:no' element={<AdminRepAns/>}/>
                <Route path='/admin/noticeCon' element={<AdminNociceCon/>}/>
                <Route path='/admin/eventCon' element={<AdminEventCon/>}/>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
      </TokenValidator>
    </BrowserRouter>

  );
}

export default App;
