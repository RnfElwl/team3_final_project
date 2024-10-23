import { useState, useEffect } from 'react';
import axios from './api/axiosApi'; // axios 경로 문제 해결 가정

// 백그라운드 이미지 설정 함수
function useBackgroundImage() {
  const [backimage, setBackimage] = useState('');

  // 이미지 가져오기
  async function fetchUsers() {
    try {
      const response = await axios.get('http://localhost:9988/user/imageworking', {
        responseType: 'blob', // 이미지 데이터를 blob 형태로 받기
      });
      const imageObjectURL = window.URL.createObjectURL(response.data);
      setBackimage(imageObjectURL);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  }

  useEffect(() => {
    fetchUsers();  // 컴포넌트가 처음 렌더링될 때만 실행

    return () => {
      const imgToRemove = document.querySelector('img.login-background');
      if (imgToRemove) {
        imgToRemove.remove();  // 컴포넌트 언마운트 시 이미지 제거
      }
    };
  }, []);  // 빈 배열로 처음 렌더링에서만 실행

  useEffect(() => {
    if (backimage) {
      // root에 이미지 추가
      const root = document.getElementById('root');
      const img = document.createElement('img');
      img.src = backimage;  // 이미지 경로 설정
      img.className = 'login-background';
      root.appendChild(img);

      // 헤더에 전환 효과 적용
      const headerElement = document.querySelector('.Header');
      if (headerElement) {
        headerElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        headerElement.style.backgroundColor = 'transparent';  // 이미지가 있을 때 투명하게 설정
      }

      return () => {
        // root에서 img 요소 제거
        const imgToRemove = root.querySelector('img.login-background');
        if (imgToRemove) {
          root.removeChild(imgToRemove);
        }

        // 헤더 배경색 복구
        if (headerElement) {
          headerElement.style.backgroundColor = '#1C1C20';  // 이미지가 없을 때 배경색 복구
        }
      };
    }
  }, [backimage]);  // backimage 값이 설정되었을 때만 DOM에 추가

  return backimage;
}

export default useBackgroundImage;
