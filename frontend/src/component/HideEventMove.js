import React, { useEffect } from 'react';

const HideEventMove = () => {
  useEffect(() => {
    const event = document.querySelector('.event_move');

    if (event) {
      event.style.display = 'none';  // 숨기기
    }

    return () => {
      // 컴포넌트 언마운트 시 복구 (필요한 경우)
      if (event) {
        event.style.display = 'flex';  // 기본값으로 복구 (원래 flex였다면)
      }
    };
  }, []);  // 빈 의존성 배열로 한 번만 실행

  return null;  // 렌더링할 것이 없으므로 null 반환
};

export default HideEventMove;
