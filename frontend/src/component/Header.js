import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import {List, Search} from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
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
  const [isChatting, setIsChatting] = useState(false);
  const [isContentVisible1, setContentVisible1] = useState(false); // 하위 div의 표시 여부 상태
  const [isContentVisible2, setContentVisible2] = useState(false); // 하위 div의 표시 여부 상태

    const toggleContent1 = () => {
        setContentVisible1(prev => !prev); // 현재 상태를 반전
    };
    const toggleContent2 = () => {
        setContentVisible2(prev => !prev); // 현재 상태를 반전
    };

  useEffect(()=>{
    location.pathname.startsWith("/admin")
    ? setIsAdminPage(true)
    : setIsAdminPage(false);

    (location.pathname).substring(0, 9) === "/chatting"
    ? setIsChatting(true)
    : setIsChatting(false);
  }, [location.pathname]);

  if(isAdminPage){
    //관리자 헤더
    return (
      <>
      <header className="Header">
          <div className='admin_header'>
             <div><img src=""/><Link to={'/admin'}>관리자페이지</Link></div>
          </div>
      </header>
        <div className="admin_navList">
          <div className="admin_nav"><Link to={'/admin'}>대쉬보드</Link></div>
          <div className="admin_nav"><Link to={'#'} onClick={toggleContent1}>사용자 관리&nbsp;
            {isContentVisible1 ? <FontAwesomeIcon icon={faChevronUp} />  :
              <FontAwesomeIcon icon={faChevronDown} />}</Link></div>
              {isContentVisible1 && (
                <div className="admin_minNav">
                  <Link to={'/admin/memCon'}>활동 멤버</Link>
                  <Link to={'#'}>비활성화 멤버</Link>
                </div>
              )}
          <div className="admin_nav"><Link to={'#'} onClick={toggleContent2}>컨텐츠 관리&nbsp;
            {isContentVisible2 ? <FontAwesomeIcon icon={faChevronUp} />  :
              <FontAwesomeIcon icon={faChevronDown} />} </Link></div>
              {isContentVisible2 && (
                <div className="admin_minNav">
                  <Link to={'/admin/qnaCon'}>QnA</Link>
                  <Link to={'/admin/comCon'}>Community</Link>
                </div>
              )}
          <div className="admin_nav"><Link to={'#'}>신고 관리</Link></div>
          <div className="admin_nav"><Link to={'#'}>통계</Link></div>
        </div>
      </>
    );
  }
  else if(isChatting){
    <>
    
    </>
  }
  else{
  //통상 헤더
  return (
      <>
      <nav className={`home_nav ${nav?'nav_show':'nav_hide'}`}>
        <div className='logo'>
          <Link to={'/'}><div><img src=""/>로고</div></Link>
        </div>
        <div className='tab'>
          <div><Link to={'/categories'} onClick={closeNav}>카테고리</Link></div>
          <div><Link to={'/chat'} onClick={closeNav}>채팅</Link></div>
          <div><Link to={'/qna'} onClick={closeNav}>QnA</Link></div>
          <div><Link to={'/community'} onClick={closeNav}>커뮤니티</Link></div>
          <div><Link to={'/recommend'} onClick={closeNav}>추천</Link></div>
        </div>
        <div className='close_box' onClick={closeNav}></div>
      </nav>
      <header className="Header">
          <div className='left-info'>
            <List color={"#c2c2c2"} size={40} onClick={showNav}/>
            <Link to={'/'}><div><img src=""/>로고</div></Link>
          </div>
          
          <div className='right-info'>
            <div className='search'>
              <Search color={"#1C1C20"} size={20}/><input  type="text" />
            </div>
            <div className='login_btn'><Link to={'/signin'}>로그인</Link></div>
            <div className='join_btn'><Link to={'/signup'}>회원가입</Link></div>
            
          </div>
      </header>
      </>
      );
  }
}
  


export default Header;