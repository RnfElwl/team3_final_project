import React, { useState } from 'react';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/signup.css';
import Modal from '../../component/api/Modal';
import DaumPostcode from "react-daum-postcode";

function Signup() {
    const [step, setStep] = useState(1);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        userid: '',
        userpwd: '',
        confirmPassword: '',
        username: '',
        useremail: '',
        usernick: '',
        usertel: '',
        zipcode: '',
        useraddr: '',
        addrdetail: '',
        userbirth: '',
        gender: ''
    });
    const [errors, setErrors] = useState({});
    const [nickCheckError, setNickCheckError] = useState('');
    const [nickCheckSuccess, setNickCheckSuccess] = useState(false);
    const [idCheckError, setIdCheckError] = useState(''); // 아이디 오류 메시지 상태
    const [idCheckSuccess, setIdCheckSuccess] = useState(false); // 아이디 성공 메시지 상태

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });

    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.userid) newErrors.userid = "아이디를 입력하세요.";
        if (!formData.userpwd) newErrors.userpwd = "비밀번호를 입력하세요.";
        if (formData.userpwd !== formData.confirmPassword) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "이름을 입력하세요.";
        if (!formData.useremail) newErrors.useremail = "이메일을 입력하세요.";
        if (!formData.usertel) newErrors.usertel = "전화번호를 입력하세요.";
        if (!formData.useraddr) newErrors.useraddr = "주소를 입력하세요.";
        if (!formData.userbirth) newErrors.userbirth = "생년월일을 입력하세요.";
        if (!formData.gender) alert("성별을 선택해주세요.");
        return newErrors;
    };
    // forcus out 시 아이디 체크
    const handleIdBlur = async () => {
        const userId = formData.userid;
        if (userId.trim() === '') {
            setIdCheckError('');
            setIdCheckSuccess(false);
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:9988/idcheck?userid=${userId}`);
            console.log("아이디 확인 응답:", response.data); // 디버깅 로그
            if (response.data === 1) {
                setIdCheckError('아이디가 이미 사용 중입니다.');
                setIdCheckSuccess(false);
            } else {
                setIdCheckError('');
                setIdCheckSuccess(true);
            }
        } catch (error) {
            console.error('아이디 확인 중 오류 발생:', error);
            setIdCheckError('아이디 확인 중 오류가 발생했습니다.');
            setIdCheckSuccess(false);
        }
    };
    // forcus out 시 닉네임 체크
    const handleNicknameBlur = async () => {
        const nickname = formData.usernick;
        console.log("닉네임 확인 중:", nickname);
        if (nickname.trim() === '') {
            setNickCheckError('');
            setNickCheckSuccess(false);
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:9988/nickcheck?usernick=${nickname}`);
            console.log("닉네임 확인 응답:", response.data);
            if (response.data === 1) {
                setNickCheckError('닉네임이 이미 사용 중입니다.');
                setNickCheckSuccess(false);
            } else {
                setNickCheckError('');
                setNickCheckSuccess(true);
            }
        } catch (error) {
            console.error('닉네임 확인 중 오류 발생:', error);
            setNickCheckError('닉네임 확인 중 오류가 발생했습니다.');
            setNickCheckSuccess(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors;

        if (step === 1) {
            validationErrors = validateStep1();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            setStep(2);
        } else {
            validationErrors = validateStep2();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            const { confirmPassword, ...dataToSubmit } = formData;
            const formDataToSend = new FormData();

            for (const key in dataToSubmit) {
                formDataToSend.append(key, dataToSubmit[key]);
            }

            // console.log(...formDataToSend);
            // console.log(formData);
            axios.post('http://localhost:9988/join', formDataToSend)
            .then(response => {
                console.log('Success:', response.data);
                setStep(3); // Proceed to the next step if the request is successful
            })
            .catch(error => {
                console.error('Error:', error);
                setErrors({ submit: 'There was an error submitting the form. Please try again.' });
            });
            // setStep(3);
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

    return (
        <div className="signup">
            <div className="container">
                <div className="signupinfo">
                    <div className={`step-bar ${step === 2 ? 'step2' : step === 3 ? 'step3' : ''}`}>
                        <span className="gradition-blue">스탭바</span>
                    </div>
                    <div id="userinfo">
                        <form className='information' onSubmit={handleSubmit}>
                            {step === 1 && (
                                <>
                                    <div>
                                        <div id="includetext">
                                            <span>S#에서</span>
                                            <span>영화를 추천!!</span>
                                        </div>
                                    </div>
                                    <div className="inputclass">
                                        <input type="text" name="userid" value={formData.userid} onChange={handleInputChange} onBlur={handleIdBlur} placeholder='아이디' />
                                        {idCheckError && ( <div className="error-message" style={{ color: 'red' }}> {idCheckError} </div> )}
                                        {idCheckSuccess && ( <div className="success-message" style={{ color: 'green' }}>사용 가능한 아이디입니다. </div> )} 
                                    </div>
                                    <div className="inputclass">
                                        <input type="password" name="userpwd" value={formData.userpwd} onChange={handleInputChange} placeholder='비밀번호' />
                                        {errors.userpwd && <div className="error-message">{errors.userpwd}</div>}
                                    </div>
                                    <div className="inputclass">
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder='비밀번호 확인' />
                                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div>
                                        <div id="includetext">
                                            <span>개인정보</span>
                                        </div>
                                    </div>
                                    <div className="inputclass" style={{ flexDirection: 'row' }}>
                                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder='이름' />
                                        {errors.username && <div className="error-message">{errors.username}</div>}
                                        <div className="gen">
                                            <div className={`gender-option ${formData.gender === '남성' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '남성' })} >
                                                <label>남성</label>
                                            </div>
                                            <div className={`gender-option ${formData.gender === '여성' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '여성' })} >
                                                <label>여성</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inputclass">
                                        <input type="text" name="useremail" value={formData.useremail} onChange={handleInputChange} placeholder='이메일' />
                                        {errors.useremail && <div className="error-message">{errors.useremail}</div>}
                                    </div>
                                    <div className="inputclass">
                                        <input type="text" name="usernick" value={formData.usernick} onChange={handleInputChange} onBlur={handleNicknameBlur} placeholder='닉네임' />
                                        {nickCheckError && (
                                            <div className="error-message" style={{ color: 'red' }}> {nickCheckError} </div>
                                        )}
                                        {nickCheckSuccess && (
                                            <div className="success-message" style={{ color: 'green' }}> 사용 가능한 닉네임입니다. </div>
                                        )}
                                    </div>
                                    <div className="inputclass">
                                        <input type="text" name="usertel" value={formData.usertel} onChange={handleInputChange} placeholder='전화번호' />
                                        {errors.usertel && <div className="error-message">{errors.usertel}</div>}
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
                                    <div className="inputclass">
                                        <input type="text" name="useraddr" value={formData.useraddr} onChange={handleInputChange}
                                        onClick={() => setIsAddressModalOpen(true)} placeholder='주소' />
                                        {errors.useraddr && <div className="error-message">{errors.useraddr}</div>}
                                    </div>
                                    <div> 
                                        <input  type="text" name="addrdetail" value={formData.addrdetail} onChange={handleInputChange} placeholder='상세주소'/>
                                    </div>
                                    <div className="inputclass">
                                        <input type="text" name="userbirth" value={formData.userbirth} onChange={handleInputChange} placeholder='생년월일' />
                                        {errors.userbirth && <div className="error-message">{errors.userbirth}</div>}
                                    </div>
                                </>
                            )}
                            {step === 3 && (
                                <div className="completion-message">
                                    <span>씬넘버에<br/>오신 걸 환영합니다!</span>
                                    <div className="sub_button">
                                        <button className="btn btn-primary" type="button" onClick={() => window.location.href = '/'}>홈으로</button>
                                    </div>
                                </div>
                            )}
                            {step < 3 && (
                                <div className="sub_button">
                                    <button className="btn btn-secondary" type="button" onClick={() => {
                                        if (step === 1) {
                                            window.history.back();
                                        } else {
                                            setStep(1);
                                        }
                                    }}>
                                        {step === 1 ? '취소' : '이전'}
                                    </button>
                                    <button className="btn btn-primary" type="submit">
                                        {step === 1 ? '다음' : '회원가입'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
