import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let hasRequiredRole = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("12", decodedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;

        hasRequiredRole =
          decodedToken.role === 'ADMIN' ||
          (decodedToken.role === 'USER' && requiredRole === 'USER');
      } else {
        localStorage.clear();
        // localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('잘못된 토큰:', error);
      localStorage.clear();
      // localStorage.removeItem('token');
    }
  }

  if (!isAuthenticated) {
    alert('로그인 후 사용 가능합니다.');
    return <Navigate to="/signin" replace />;
  }


  if (!hasRequiredRole) {
    alert('이용 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
