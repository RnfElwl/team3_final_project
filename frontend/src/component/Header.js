import React, { useState, useEffect, useRef } from 'react';
import axios from './api/axiosApi';
import CustomImage from './CustomImage';
// import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {List, Search} from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './css/navigationbar.css';
import { useAuth } from './TokenValidator';

function Header() {
  const [nav, setNav] = useState(false);
  const [myid, setMyid] = useState("");
  const [searchWord, setSearchWord]=useState("");
  const [userData, setUserData] = useState({});
  const underLine = useRef();
  const [index, setIndex] = useState(0);
  const tabList = useRef([]);
  function closeNav(){
    setNav(false);
  }
  function showNav(){
    setNav(true);
  }
  const location =useLocation();
  const navigate = useNavigate();
  const [isAdminPage, setIsAdminPage]=useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isContentVisible1, setContentVisible1] = useState(false); // 하위 div의 표시 여부 상태
  const [isContentVisible2, setContentVisible2] = useState(false); // 하위 div의 표시 여부 상태
  const [isContentVisible3, setContentVisible3] = useState(false); // 하위 div의 표시 여부 상태

    const toggleContent1 = () => {
        setContentVisible1(prev => !prev); // 현재 상태를 반전
    };
    const toggleContent2 = () => {
        setContentVisible2(prev => !prev); // 현재 상태를 반전
    };
    const toggleContent3 = () => {
      setContentVisible3(prev => !prev); // 현재 상태를 반전
    };

    async function getUser() {
      try {
          const result = await axios.get('http://localhost:9988/user/userinfo');
          setMyid(result.data); // 사용자 ID 설정
          console.log(result);
          const params = { userid: result.data };
          const result2 = await axios.get('http://localhost:9988/getUserData', { params });
          setUserData(result2.data); // 사용자 데이터 설정
      } catch (error) {
          console.error("Error fetching user info:", error);
      }
  }  
  useEffect(()=>{
    getUser();
  }, [])
  
  useEffect(()=>{
    location.pathname.startsWith("/admin")
    ? setIsAdminPage(true)
    : setIsAdminPage(false);

    (location.pathname).substring(0, 9) === "/chatting"
    ? setIsChatting(true)
    : setIsChatting(false);
  }, [location.pathname]);
  
  // 로그인 여부 판단용
  const { isAuthenticated, logout } = useAuth();
  function hendleSearchInput(e){
    setSearchWord(e.target.value);
  }
  function searchMovie(e){
    e.preventDefault();
    if(searchWord == ""){
      return;
    }
    navigate("/categories/search/"+searchWord)//키워드로 영화검색
  }
  // 로그인 여부 판단용 여기까지
  function tabClick(i){
    setIndex(i);
  }
  useEffect(() => {
    if(index == -1 || location.pathname.startsWith("/admin")){
      underLine.current.style.display = `none`; // 밑줄 너비 설정
      
    }
    else{
      underLine.current.style.display = `block`; 
    }
    const currentTab = tabList.current[index]; // 현재 활성 탭
    if (currentTab && underLine.current) {
      underLine.current.style.width = `${currentTab.offsetWidth}px`; // 밑줄 너비 설정
      underLine.current.style.left = `${currentTab.offsetLeft}px`; // 밑줄 위치 설정
    }
  }, [index]);
  if(isAdminPage){
    //관리자 헤더
    return (
      <>
      <header className="Header">
          <div className='admin_header'>
             <div><Link to={'/'}><img src="../../logo3.png" width={"200px"} /></Link><Link to={'/admin'}>관리자페이지</Link></div>
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
                  <Link to={'/admin/banMemCon'}>정지 멤버</Link>
                </div>
              )}
          <div className="admin_nav"><Link to={'#'} onClick={toggleContent2}>컨텐츠 관리&nbsp;
            {isContentVisible2 ? <FontAwesomeIcon icon={faChevronUp} />  :
              <FontAwesomeIcon icon={faChevronDown} />} </Link></div>
              {isContentVisible2 && (
                <div className="admin_minNav">
                  <Link to={'/admin/qnaCon'}>QnA</Link>
                  <Link to={'/admin/comCon'}>Community</Link>
                  <Link to={'/admin/movCon'}>Movie</Link>
                </div>
              )}
          <div className="admin_nav"><Link to={'/admin/repCon'}>신고 관리</Link></div>
          
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
      {/* <nav className={`home_nav ${nav?'nav_show':'nav_hide'}`}>
        <div className='logo'>
          <Link to={'/'}><div><img src=""/>로고</div></Link>
        </div>
        <div className='tab'>
          <div><Link to={'/categories'} onClick={closeNav}>카테고리</Link></div>
          {
            myid!==''&&(<div><Link to={'/chat'} onClick={closeNav}>채팅</Link></div>)
          }
          <div><Link to={'/qna'} onClick={closeNav}>QnA</Link></div>
          <div><Link to={'/community'} onClick={closeNav}>커뮤니티</Link></div>
          <div><Link to={'/recommend'} onClick={closeNav}>추천</Link></div>
        </div>
        <div className='close_box' onClick={closeNav}></div>
      </nav> */}
      <header className="Header">
          <div className='left-info'>
            {/* <List color={"#c2c2c2"} size={40} onClick={showNav}/> */}
            <Link to={'/'} onClick={()=>{tabClick(0)}}><div><img src="../../logo3.png" width={"200px"} /></div></Link>
            <div className='tab'>
            <div className={`${index==0?'focus':''}`}><Link to={'/'} onClick={()=>{tabClick(0)}} ref={(el) => (tabList.current[0] = el)} >Home</Link></div>
            <div className={`${index==1?'focus':''}`}><Link to={'/categories'} onClick={()=>{tabClick(1)}} ref={(el) => (tabList.current[1] = el)} >Movie</Link></div>
            {
              myid!==''&&(<div className={`${index==2?'focus':''}`}><Link to={'/chat'} onClick={()=>{tabClick(2)}} ref={(el) => (tabList.current[2] = el)}>Chat</Link></div>)
            }
            <div className={`${index==3?'focus':''}`}><Link to={'/qna'} onClick={()=>{tabClick(3)}} ref={(el) => (tabList.current[3] = el)}>QnA</Link></div>
            <div className={`${index==4?'focus':''}`}><Link to={'/community'} onClick={()=>{tabClick(4)}} ref={(el) => (tabList.current[4] = el)}>Community</Link></div>
            {
              myid!==''&&(<div className={`${index==5?'focus':''}`}><Link to={'/recommend'} onClick={()=>{tabClick(5)}} ref={(el) => (tabList.current[5] = el)}>Recommend</Link></div>)
            }
          </div>
          <div className='under_line' ref={underLine}></div>
          </div>
          
          <div className='right-info'>
            <form className='search' onSubmit={searchMovie} onClick={()=>{tabClick(-1)}}>
              <Search color={"#111120"} size={20}/><input  type="text" value={searchWord} onChange={hendleSearchInput}/>
            </form>

              {isAuthenticated ? (
            // 토큰이 있는 경우: 로그아웃 버튼 표시
              <div className='profile' style = {{display:'flex'}}>
                <Link to="/mypage">
                  <CustomImage
                  onClick={()=>{tabClick(-1)}}
                    src={`http://localhost:9988/${userData.image_url}`}
                    alt="프로필 아이콘"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', cursor: 'pointer' }}
                  />
                </Link>
                <button className='join_btn' onClick={logout}>Logout</button>
              </div>
              ) : (
              // 토큰이 없는 경우: 로그인 및 회원가입 버튼 표시
              <>
                <div className='login_btn' ><Link onClick={()=>{tabClick(-1)}} to={'/signin'}>Login</Link></div>
                <div className='join_btn'><Link onClick={()=>{tabClick(-1)}} to={'/signup'}>Join</Link></div>
              </>
              )}
            {/* <div className='login_btn'><Link to={'/signin'}>로그인</Link></div>
            <div className='join_btn'><Link to={'/signup'}>회원가입</Link></div> */}
            
          </div>
      </header>
      </>
      );
  }
}
  


export default Header;