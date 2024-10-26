import React from 'react';

const CustomImage = ({ src, alt, ...props }) => {
  // const BASE_URL = 'http://192.168.1.88:9988'; // 서버 IP
  //  const BASE_URL = 'http://localhost:9988';
  const BASE_URL = `${window.location.protocol}//${window.location.hostname}:9988`;

  // src가 정의되어 있는지 확인
  const imageUrl = src && src.startsWith('http://localhost:9988')
    ? src.replace('http://localhost:9988', BASE_URL)
    : src || ''; // src가 undefined면 빈 문자열을 반환

  return <img src={imageUrl} alt={alt} {...props} />;
};

export default CustomImage;
