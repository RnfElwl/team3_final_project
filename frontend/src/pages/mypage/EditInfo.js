import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/editinfo.css';
import ImageUploader from '../../component/api/ImageUploader';
import profile from '../../img/profile.png';
import Modal from '../../component/api/Modal';
import DaumPostcode from "react-daum-postcode";


function EditInfo() {
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [images, setImages] = useState(profile);
    const [formData, setFormData] = useState({
        userid: '',
        usernick: '',
        username: '',
        userbirth: '',
        usertel: '',
        useremail: '',
        useraddr: '',
        zipcode: '',
        addrdetail: '',
        gender : ''
    });
    //초기 데이터 로딩
    useEffect(() => {
        fetchProfile();
        
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9988/user/info');
                const userData = response.data;
                setFormData({
                    userid: userData.userid || '',
                    usernick: userData.usernick || '',
                    username: userData.username || '',
                    userbirth: userData.userbirth || '',
                    usertel: userData.usertel || '',
                    useremail: userData.useremail || '',
                    useraddr: userData.useraddr || '',
                    zipcode: userData.zipcode || '',
                    addrdetail: userData.addrdetail || '',
                    gender : userData.gender || ''
                });

                if (userData.imageUrl) {
                    setImages([userData.imageUrl]);
                }

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchData();
    }, []);

    async function fetchProfile() {
        try {
            const response = await axios.get('http://localhost:9988/user/loadprofile', {
              responseType: 'blob', // 이미지 데이터를 blob 형태로 받기
            });
            if (response.status === 200) {
                console.log("response.data", response.data);
                const imageObjectURL = window.URL.createObjectURL(response.data);
                setImages(imageObjectURL);
            }else if (response.status === 404) {
                console.log("No profile image found, using default.");
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    }
    // 새로운 이미지 업로드시 바로 적용 후 사용자 db 및 폴더에 추가
    const handleImageChange = (newImages) => {
        setImages(URL.createObjectURL(newImages[0]));
        handleSubmit(newImages);
    };
    const handleSubmit = (newImages) => {   
        if(newImages.length === 0){
            console.log("새로운 이미지가 없음");
            return;
        }
        const formData = new FormData();
        newImages.forEach((image) => {
            formData.append('images', image);
        });

        // Axios를 사용한 POST 요청
        axios.post('http://localhost:9988/user/uploadProfile', formData)
            .then(response => {
                console.log('Success:', response.data);  
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    const handleInfoSubmit = (e) => {
        e.preventDefault(); // 페이지 리로드 방지
        const data = {
            userid: formData.userid,
            usernick: formData.usernick,
            username: formData.username,
            userbirth: formData.userbirth,
            usertel: formData.usertel,
            useremail: formData.useremail,
            useraddr: formData.useraddr,
            zipcode: formData.zipcode,
            addrdetail: formData.addrdetail
        };

        // 서버로 사용자 정보 전송
        axios.post('http://localhost:9988/user/update', data)
            .then(response => {
                if (response.data > 0) {
                    console.log('User info updated successfully:', response.data);
                    // 여기에서 성공 메시지 표시할 수 있음
                } else {
                    console.error('Failed to update user info or unauthorized:', response.data);
                    // 실패 메시지 표시할 수 있음
                }
            })
            .catch(error => {
                console.error('Error updating user info:', error);
            });
    };
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
    
        if (newPassword === confirmPassword) {
            console.log("working");
            axios.post('http://localhost:9988/user/change-password', { 
                    userid: formData.userid,
                    currentPassword,
                    newPassword 
                })
                .then(response => {
                    const message = response.data;
                    if (message === "Password changed successfully.") {
                        console.log('비밀번호가 성공적으로 변경되었습니다.');
                        alert('비밀번호가 성공적으로 변경되었습니다.');
                    } else if (message === "Current password is incorrect.") {
                        alert("비밀번호 변경 실패: 기존 비밀번호가 올바르지 않습니다.");
                    } else if (message === "User ID mismatch.") {
                        alert("비밀번호 변경 실패: 사용자 ID가 일치하지 않습니다.");
                    } else {
                        alert("비밀번호 변경 실패: 알 수 없는 오류가 발생했습니다.");
                    }
                    setIsPasswordModalOpen(false); // 모달 닫기
                })
                .catch(error => {
                    console.error('비밀번호 변경 중 오류 발생:', error);
                    alert("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.");
                });
        } else {
            alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }
    };
    const handleAddressSelect = (data) => {
        // 선택된 주소를 상태에 저장
        setFormData({
            ...formData,
            useraddr: data.address,
            zipcode: data.zonecode // postal code
        });
        setIsAddressModalOpen(false); // 모달 닫기
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);
    return (
        <div className="editInfo">
            <div className="container">
                <div className = "editprofile">
                    <div id = "profile">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <img src = {images} onClick={() => document.querySelector('input[type="file"]').click()} ></img>
                        <ImageUploader onImageChange={handleImageChange}/>
                    </form>
                    </div>
                    <div id = "userinfo">
                        <form className='information' onSubmit={handleInfoSubmit}>
                            <div> 
                                <span>이름</span> 
                                <input type="text" name="username" value={formData.username} disabled />
                            </div>
                            <div> 
                                <span style={{ width: "141.8px" }}>비밀번호</span> 
                                <span style = {{color : "white"}} onClick={() => setIsPasswordModalOpen(true)}>비밀번호 변경하기{'>'}</span> 
                            </div>
                               
                            <div> 
                                <span>닉네임</span> 
                                <input 
                                    type="text" 
                                    name="usernick" 
                                    value={formData.usernick} 
                                    onChange={(e) => setFormData({ ...formData, usernick: e.target.value })} />
                            </div>
                            <div> 
                                <span style={{ width: "141.8px" }}>성별</span>  
                                <span style={{color : "white", fontWeight:"400"}}>{formData.gender === "1" ? '남' : formData.gender === "2" ? '여' : ''}</span> 
                            </div>
                            <div> 
                                <span>생년월일</span> 
                                <input 
                                    type="text" 
                                    name="userbirth" 
                                    value={formData.userbirth} 
                                    onChange={(e) => setFormData({ ...formData, userbirth: e.target.value })} />
                            </div>
                            <div> 
                                <span>휴대폰 번호</span>  
                                <input 
                                    type="text" 
                                    name="usertel" 
                                    value={formData.usertel} 
                                    onChange={(e) => setFormData({ ...formData, usetel: e.target.value })} />
                            </div>
                            <div> 
                                <span>이메일</span>  
                                <input 
                                    type="email" 
                                    name="useremail" 
                                    value={formData.useremail} 
                                    onChange={(e) => setFormData({ ...formData, useremail: e.target.value })} /> 
                            </div>

                            {isAddressModalOpen && (
                                    <Modal onClose={() => setIsAddressModalOpen(false)} title="" className = "addrmodal">
                                    <DaumPostcode 
                                       theme={{
                                        bgColor: "#252525", // 바탕 배경색
                                        searchBgColor: "#252525", // 검색창 배경색
                                        contentBgColor: "#252525", // 본문 배경색
                                        pageBgColor: "#252525", // 페이지 배경색
                                        textColor: "#ffffff", // 기본 글자색
                                        queryTextColor: "#ffffff", // 검색창 글자색
                                        postcodeTextColor: "#ff0000", // 우편번호 글자색
                                        emphTextColor: "", // 강조 글자색
                                        outlineColor: "#ffffff", // 테두리 색상
                                    }}
                                        onComplete={handleAddressSelect}/>
                                    </Modal>
                                )}
                            <div hidden> 
                                <span>우편번호</span>  
                                <input type = "text" name = "zipcode" value = ""/> 
                            </div>
                            <div> 
                                <span>주소</span>  
                                <input 
                                        type="text" 
                                        name="useraddr" 
                                        value={formData.useraddr} 
                                        onChange={(e) => setFormData({ ...formData, useraddr: e.target.value })} 
                                        onClick={() => setIsAddressModalOpen(true)}/> 
                            </div>
                            <div> 
                                <span>상세주소</span>  
                                <input 
                                    type="text" 
                                    name="addrdetail" 
                                    value={formData.addrdetail} 
                                    onChange={(e) => setFormData({ ...formData, addrdetail: e.target.value })} 
                                    />
                            </div>
                            
                            <div className = "sub_button">
                                <button className="btn btn-secondary" onClick={() => window.location.href = '/mypage'}>취소</button>
                                <button className="btn btn-primary">수정</button>
                            </div>
                        </form>
                        {/* 비밀번호 변경용 모달 */}
                        <div className='information'>
                            {isPasswordModalOpen && (
                            <Modal onClose={() => setIsPasswordModalOpen(false)} title="비밀번호 설정">
                                <form onSubmit={handlePasswordSubmit} className = "changepwd">
                                    <input type="text" value={formData.userid} placeholder="userid" disabled />
                                    <input type = "password" id ="currentPassword" placeholder ="기존 비밀번호" required/>
                                    <input type="password" id="password" placeholder="새 비밀번호" required />
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                    <input type="password" id="confirmPassword" placeholder="비밀번호 확인" required />
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                    <button type="submit" className="btn btn-secondary">변경하기</button>
                                </form>
                            </Modal>
                            )}
                        </div>
                    </div>
                    <div className = "leave-button">
                    <button className = "btn btn-link">회원탈퇴</button>
                </div>
                </div>
            </div>
        </div>

    );
}
export default EditInfo;