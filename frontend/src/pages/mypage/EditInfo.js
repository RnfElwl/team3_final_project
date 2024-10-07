import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/editinfo.css';
import ImageUploader from '../../component/api/ImageUploader';

function EdidInfo() {
    const [images, setImages] = useState([]);

    const handleImageChange = (newImages) => {
        setImages(newImages);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });

        // Axios를 사용한 POST 요청
        axios.post('http://localhost:9988/user/upload', formData)
            .then(response => {
                console.log('Success:', response.data);  
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    return (
        <div className="editInfo">
            <div className="container">
              <div className = "editprofile">
                <form onSubmit={handleSubmit}>
                    <ImageUploader onImageChange={handleImageChange} />
                    <button type="submit">Submit</button>
                </form>
              </div>
            </div>
        </div>

    );
}
export default EdidInfo;