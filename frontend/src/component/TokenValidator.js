import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// 인증 상태를 관리하기 위한 Context 생성
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const TokenValidator = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log("to" , decodedToken);
        if (decodedToken.exp > currentTime) {
          // 유효한 토큰인 경우 로그인 상태로 설정
          setIsAuthenticated(true);
        } else {
          // 만료된 토큰일 경우 로그아웃 처리
          localStorage.removeItem("token");
          //localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        // 잘못된 토큰일 경우 로그아웃 처리
        localStorage.removeItem("token");
        //localStorage.clear();
        setIsAuthenticated(false);
      }
    } else {
      // 토큰이 없는 경우 로그아웃 상태로 설정
      setIsAuthenticated(false);
    }
  }, [location]);

  // 로그아웃 함수
  const logout = () => {
    localStorage.clear(); // 모든 항목을 삭제
    setIsAuthenticated(false); // 로그아웃 상태로 설정
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default TokenValidator;
