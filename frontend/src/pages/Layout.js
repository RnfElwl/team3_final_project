import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../component/TokenValidator';

function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showHeader, setShowHeader] = useState(true);

  // useEffect(() => {
  //   // location.pathname 또는 isAuthenticated 변경 시 Header 표시 상태를 토글
  //   setShowHeader(false);
  //   // setShowHeader(true);
  //   setTimeout(() => setShowHeader(true), 0); // 바로 다시 표시
  // }, [location.pathname, isAuthenticated]);

  // 헤더를 숨길 경로를 배열로 지정
  const hideHeaderRoutes = ['/admin/adminQAns', '/admin/repAns/', '/find', '/success', '/reset-password', '/admin/banEdit'];
  const hideFooterRoutes = ['/find', '/success', '/signin', '/signup', '/reset-password', '/admin/adminQAns', '/admin/repAns/', '/admin/banEdit'];

  // 현재 경로가 hideHeaderRoutes에 포함된 경로로 시작하는지 확인
  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const shouldHideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {/* showHeader와 shouldHideHeader를 결합하여 Header 렌더링 결정 */}
      {showHeader && !shouldHideHeader && <Header />}
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </>
  );
}

export default Layout;
