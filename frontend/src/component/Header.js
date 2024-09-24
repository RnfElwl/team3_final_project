import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  return (
      <>
      <nav className={`home_nav ${nav?'nav_show':'nav_hide'}`}>
        <div className='logo'>
          <img src=''/> 로고
        </div>
        <div className='tab'>
          <div><Link to={'/categories'} onClick={closeNav}>카테고리</Link></div>
          <div><Link to={'/chat'} onClick={closeNav}>채팅</Link></div>
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
            <div className='login_btn'><Link to={'/login'}>로그인</Link></div>
            <div className='join_btn'><Link to={'/join'}>회원가입</Link></div>  
          </div>
      </header>
      </>
      );
  }
  


export default Header;