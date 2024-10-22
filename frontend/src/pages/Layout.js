import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
// import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  // 헤더를 숨길 경로를 배열로 지정
  const hideHeaderRoutes = ['/admin/adminQAns','/admin/repAns/', '/find', '/success'];

  // 현재 경로가 hideHeaderRoutes에 포함된 경로로 시작하는지 확인
  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
      <>
        {!shouldHideHeader && <Header />}
        {/* <Header/> */}
          <Outlet/>
        <Footer/>
      </>

  );
}

export default Layout;