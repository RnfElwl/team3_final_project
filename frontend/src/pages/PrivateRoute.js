import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // JWT 해독 라이브러리 설치 필요: npm install jwt-decode

// PrivateRoute 컴포넌트 정의
const PrivateRoute = () => {
  const token = localStorage.getItem('accessToken');
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)

      // decodedToken 예시: { userid: 'someUserId', role: 'USER', iat: 1692304567, exp: 1692308167 }
      if (decodedToken.exp > currentTime) {
        // 토큰 만료 시간이 현재 시간보다 크다면 유효한 토큰
        isAuthenticated = true;
      } else {
        // 토큰이 만료되었으므로 localStorage에서 제거
        localStorage.removeItem('accessToken');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      // 토큰이 유효하지 않은 경우 (예: 구조가 잘못된 경우)
      localStorage.removeItem('accessToken');
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
