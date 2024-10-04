import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import {List, Search} from 'react-bootstrap-icons';
import './css/navigationbar.css';


function Header() {
  const [nav, setNav] = useState(false);
  function closeNav(){
    setNav(false);
  }
  function showNav(){
    setNav(true);
  }
  const location =useLocation();
  const [isAdminPage, setIsAdminPage]=useState(false);

  useEffect(()=>{
    location.pathname === "/adminTest"
    ? setIsAdminPage(true)
    : setIsAdminPage(false);
  }, [location.pathname]);

  if(isAdminPage){
    //관리자 헤더
    return (
      <>
      <header className="Header">
          <div className='admin_header'>
             <div><img src=""/>관리자페이지</div>
          </div>
      </header>
        <div className="admin_nav">
          <div><Link to={'/adminTest'}>대쉬보드</Link></div>
          <div><Link to={'#'}>사용자 관리</Link></div>
          <div><Link to={'#'}>컨텐츠 관리</Link></div>
          <div><Link to={'#'}>상품 관리</Link></div>
          <div><Link to={'#'}>통계</Link></div>
          <div><Link to={'#'}>신고 관리</Link></div>
        </div>
      </>
    );
  }else{
  //통상 헤더
  return (
      <>
      <nav className={`home_nav ${nav?'nav_show':'nav_hide'}`}>
        <div className='logo'>
          <img src=''/> 로고
        </div>
        <div className='tab'>
          <div><Link to={'/categories'} onClick={closeNav}>카테고리</Link></div>
          <div><Link to={'/chat'} onClick={closeNav}>채팅</Link></div>
          <div><Link to={'/qna'} onClick={closeNav}>QnA</Link></div>
          <div><Link to={'/community'} onClick={closeNav}>커뮤니티</Link></div>
        </div>
        <div className='close_box' onClick={closeNav}></div>
      </nav>
      <header className="Header">
          <div className='left-info'>
            <List color={"white"} size={40} onClick={showNav}/>
             <div><img src=""/>로고</div>
          </div>
          
          <div className='right-info'>
            <div className='search'>
              <Search color={"black"} size={20}/><input  type="text" />
            </div>
            <div className='login_btn'><Link to={'/signin'}>로그인</Link></div>
            <div className='join_btn'><Link to={'/join'}>회원가입</Link></div>
            
          </div>
      </header>
      </>
      );
  }
}
  


export default Header;