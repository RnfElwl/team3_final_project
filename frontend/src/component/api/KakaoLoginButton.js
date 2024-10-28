import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const KakaoLoginButton = ({ className, imgSrc, altText }) => {
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const kakaoScript = document.createElement("script");
    kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.js";
    kakaoScript.async = true;
    kakaoScript.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("c460e115eb38e1dc37e7c2c96827747a");
        setIsKakaoInitialized(true);
      }
    };
    document.head.appendChild(kakaoScript);

    return () => {
      document.head.removeChild(kakaoScript);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (isKakaoInitialized) {
      window.Kakao.Auth.login({
        success: (authObj) => {
          console.log(authObj);
          sendTokenToBackend(authObj.access_token);
        },
        fail: (err) => {
          console.error(err);
        },
      });
    } else {
      console.error("Kakao SDK가 아직 초기화되지 않았습니다.");
    }
  };

  // const handleKakaoLogout = () => {
  //   if (window.Kakao && window.Kakao.Auth) {
  //     window.Kakao.Auth.logout(() => {
  //       console.log("Logged out from Kakao on client");
        
  //       // 강제로 SDK 세션 초기화
  //       window.Kakao.Auth.setAccessToken(null);

  //       // localStorage에서 kakao 관련 세션 삭제
  //       Object.keys(localStorage).forEach((key) => {
  //         if (key.startsWith("kakao_")) {
  //           localStorage.removeItem(key);
  //         }
  //       });
  //       window.location.reload();
  //     });
  //   } else {
  //     console.error("Kakao SDK가 초기화되지 않았습니다.");
  //   }
  // };

  const sendTokenToBackend = async (token) => {
    try {
        const response = await axios.post("http://localhost:9988/auth/kakao", {
            token,
        });

        console.log(response.data);

        // 기존 사용자일 경우 토큰 저장 및 리디렉션
        if (response.data.status === "existing_user") {
            if (response.data.token && response.data.refreshToken) {
                // 토큰을 localStorage에 저장
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                console.log("JWT token and refresh token stored in localStorage");

                // 원하는 페이지로 리디렉션 (예: 메인 페이지)
                window.location.href = "/"; // 리디렉션할 페이지 경로를 설정
            } else {
                console.error("Tokens not found in the response");
            }
        } else if (response.data.status === "new_user") {
            // 신규 사용자일 경우 회원가입 페이지로 리디렉션, userid를 쿼리 파라미터로 전달
            navigate('/kakaosignup', { state: { userid: response.data.userid } });
        }

    } catch (error) {
        console.error("Error sending token to backend", error);
    }
};

  return (
    <div>
      <button onClick={handleKakaoLogin} className={className} disabled={!isKakaoInitialized}>
        <img src={imgSrc} alt={altText} />
      </button>
      {/* <button onClick={handleKakaoLogout} className={className}>
        로그아웃
      </button> */}
    </div>
  );
};

export default KakaoLoginButton;
