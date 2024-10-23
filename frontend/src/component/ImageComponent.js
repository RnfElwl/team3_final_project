import React, { memo } from 'react';

// 이미지 컴포넌트 정의
const ImageComponent = memo(({ image, index }) => (
    <div key={index} className="background-image-container">
        <img
            src={image.src}
            alt={`Background ${index}`}
            style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                opacity: image.isBright ? 0.6 : 1 // 밝은 이미지의 경우 불투명도 낮춤
            }}
        />
    </div>
));

export default ImageComponent;