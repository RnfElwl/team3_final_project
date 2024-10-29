import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// AuthContext 생성
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const TokenValidator = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Private Routes 목록 정의
  const privateRoutes = {
    USER: ['/chat', '/chatting', '/mypage', '/mypage/edit', '/mypage/mypost', '/mypage/more', '/qna/write', '/qna/edit', '/community/CommunityWrite', '/community/CommunityEdit'],
    ADMIN: ['/admin', '/admin/qnaCon', '/admin/adminQAns', '/admin/comCon', '/admin/memCon', '/admin/banMemCon', '/admin/banEdit', '/admin/movCon', '/admin/repCon', '/admin/repAns', '/admin/noticeCon'],
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          // 유효한 토큰일 경우 로그인 상태로 설정
          setIsAuthenticated(true);
        } else {
          // 만료된 토큰일 경우 로그아웃 처리
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        // 잘못된 토큰일 경우 로그아웃 처리
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      // 토큰이 없는 경우 로그아웃 상태로 설정
      setIsAuthenticated(false);
    }
  }, [location]);

  // 로그아웃 함수
  const logout = () => {
    // Kakao 로그아웃 처리
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(() => {
        console.log("Logged out from Kakao on client");

        // SDK 세션 초기화
        window.Kakao.Auth.setAccessToken(null);

        // localStorage에서 Kakao 관련 세션 삭제
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('kakao_')) {
            localStorage.removeItem(key);
          }
        });
      });
    }

    localStorage.clear(); // 모든 항목을 삭제
    setIsAuthenticated(false); // 로그아웃 상태로 설정

    // Private Page 여부 확인 후 리다이렉트
    const isUserPrivatePage = privateRoutes.USER.some(route => location.pathname.startsWith(route));
    const isAdminPrivatePage = privateRoutes.ADMIN.some(route => location.pathname.startsWith(route));

    if (isUserPrivatePage || isAdminPrivatePage) {
      window.location = "/";
      // navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default TokenValidator;
