// KakaoCallback.js
import React, { useEffect } from 'react';
import axios from './axiosApi';

function KakaoCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    console.log("Current URL:", window.location.href);
    console.log("Authorization Code:", authorizationCode);

    if (authorizationCode) {
      // Authorization Code를 백엔드로 전달
      axios.post('http://localhost:9988/auth/kakao/kakao-login', {
        code: authorizationCode,
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          // JWT 토큰을 받아서 로컬 스토리지에 저장하거나, 로그인 처리
          localStorage.setItem('jwt', data.token);
          window.location.href = '/main'; // 메인 페이지로 리다이렉트
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default KakaoCallback;
