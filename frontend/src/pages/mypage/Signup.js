import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/editinfo.css';
import ImageUploader from '../../component/api/ImageUploader';
import profile from '../../img/profile.png';

function Signup() {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        nickname: '',
        name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        birthDate: '',
        phone: '',
        email: '',
        address: ''
    });
    // 초기 데이터 로딩
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9988/user/info'); // 실제 API 엔드포인트
                const userData = response.data;

                // 상태 초기화
                setFormData({
                    nickname: userData.nickname || '',
                    name: userData.name || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    birthDate: userData.birthDate || '',
                    phone: userData.phone || '',
                    email: userData.email || '',
                    address: userData.address || ''
                });

                // 이미지 URL 설정
                if (userData.imageUrl) {
                    setImages([userData.imageUrl]);
                }

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchData();
    }, []);

    const handleImageChange = (newImages) => {
        setImages(newImages);
        console.log(newImages);
        handleSubmit(newImages);
    };
    const handleSubmit = (newImages) => {   
        //event.preventDefault();
        if(newImages.length === 0){
            console.log("새로운 이미지가 없음");
            return;
        }
        const formData = new FormData();
        newImages.forEach((image) => {
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
                    <div id = "userinfo">
                    <form className='information'>
                        <div> <span>닉네임</span> <input type ="text" value = "동해번쩍"/></div>
                        <div> <span>이름</span> <input type ="text" value = "홍길동" disabled/></div>
                        <div> <span>기존 비밀번호</span> <input type = "password"/> </div>
                        <div> <span>신규 비밀번호</span> <input type = "password"/> </div>
                        <div> <span>비밀번호 확인</span>  <input type = "password"/> </div>
                        <div> <span style={{ width: "141.8px" }}>성별</span>  <span>남</span> </div>
                        <div> <span>생년월일</span> <input type = "text" value = "1995.01.01"/></div>
                        <div> <span>휴대폰 번호</span>  <input type = "text" value = "010-1234-1234"/></div>
                        <div> <span>이메일</span>  <input type = "email" value = "hong@naver.com"/> </div>
                        <div> <span>주소</span>  <input type = "text" value = "서울시 성수동"/> </div>
                        <div className = "sub_button">
                            <button className="btn btn-secondary" onClick={() => window.history.back()}>취소</button>
                            <button className="btn btn-primary">수정</button>
                        </div>
                    </form>
                    </div>
                    <div className = "leave-button">
                    <button className = "btn btn-link">회원탈퇴</button>
                </div>
                </div>
            </div>
        </div>

    );
}
export default Signup;