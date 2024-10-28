import React from "react";
import axios from "./axiosApi";

const KakaoLogoutButton = ({ accessToken }) => {
  const handleKakaoLogout = () => {
    if (window.Kakao && window.Kakao.Auth) {
      // 클라이언트 측 로그아웃
      window.Kakao.Auth.logout(() => {
        console.log("Logged out from Kakao on client");
        
        // 서버 측 로그아웃
        handleServerLogout();
      });
    }
  };

  const handleServerLogout = async () => {
    try {
      const response = await axios.post("http://localhost:9988/auth/kakao/logout", {
        token: accessToken, // accessToken을 전달하여 서버 로그아웃 요청
      });
      console.log(response.data); // 로그아웃 결과 메시지
    } catch (error) {
      console.error("Server logout error", error);
    }
  };

  return (
    <button onClick={handleKakaoLogout}>
      카카오 로그아웃
    </button>
  );
};

export default KakaoLogoutButton;
