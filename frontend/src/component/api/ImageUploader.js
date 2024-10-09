import React from 'react';

const ImageUploader = ({ onImageChange }) => {
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files); // 선택한 파일들을 배열로 변환
        onImageChange(files); // 부모 컴포넌트의 함수 호출
    };

    return (
        <div>
            <input 
                type="file" 
                multiple 
                onChange={handleImageChange} // 파일 선택 시 호출되는 핸들러
            />
        </div>
    );
};

export default ImageUploader;