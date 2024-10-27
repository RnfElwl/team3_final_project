import React, { useEffect } from 'react';

const HideEventMove = () => {
  useEffect(() => {
    // MutationObserver 설정
    const observer = new MutationObserver(() => {
      const event = document.querySelector('.event_move');
      if (event) {
        event.style.display = 'none';
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      const event = document.querySelector('.event_move');
      if (event) {
        event.style.display = 'flex';
      }
    };
  }, []);

  return null;
};

export default HideEventMove;
