import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/signup.css';
import Modal from '../../component/api/Modal';
import DaumPostcode from "react-daum-postcode";
import Masonry from "react-masonry-css";

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
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

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
        const idRegex = /^[a-zA-Z0-9]{6,20}$/;
        const pwdRegex = /^[a-zA-Z0-9!@#]{6,20}$/;

        if (!formData.userid) {
            newErrors.userid = "아이디를 입력하세요.";
        } else if (!idRegex.test(formData.userid)) {
            newErrors.userid = "아이디는 6~20자의 영문자와 숫자로 구성되어야 합니다.";
        }

        if (!formData.userpwd) {
            newErrors.userpwd = "비밀번호를 입력하세요.";
        } else if (!pwdRegex.test(formData.userpwd)) {
            newErrors.userpwd = "비밀번호는 6~20자의 영문자, 숫자, 특수문자(!@#)로 구성되어야 합니다.";
        }

        if (formData.userpwd !== formData.confirmPassword) {
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        }
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const nameRegex = /^[가-힣]{2,10}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]{2,20}@[a-zA-Z0-9.-]{2,10}\.[a-zA-Z]{2,5}$/;
        const nickRegex = /^[a-zA-Z0-9가-힣]{2,20}$/;
        const telRegex = /^\d{3}-\d{4}-\d{4}$/;
        const birthRegex = /^\d{4}\.\d{2}\.\d{2}$/;

        if (!formData.username) {
            newErrors.username = "이름을 입력하세요.";
        } else if (!nameRegex.test(formData.username)) {
            newErrors.username = "이름은 2~10자의 한글로 구성되어야 합니다.";
        }

        if (!formData.useremail) {
            newErrors.useremail = "이메일을 입력하세요.";
        } else if (!emailRegex.test(formData.useremail)) {
            newErrors.useremail = "유효한 이메일 주소를 입력하세요.";
        }

        if (!formData.usernick) {
            newErrors.usernick = "닉네임을 입력하세요.";
        } else if (!nickRegex.test(formData.usernick)) {
            newErrors.usernick = "닉네임은 2~20자의 영문자, 숫자, 한글로 구성되어야 합니다.";
        }

        if (!formData.usertel) {
            newErrors.usertel = "전화번호를 입력하세요.";
        } else if (!telRegex.test(formData.usertel)) {
            newErrors.usertel = "전화번호는 3자리-4자리-4자리 형식이어야 합니다.";
        }

        if (!formData.useraddr) {
            newErrors.useraddr = "주소를 입력하세요.";
        }

        if (!formData.userbirth) {
            newErrors.userbirth = "생년월일을 입력하세요.";
        } else if (!birthRegex.test(formData.userbirth)) {
            newErrors.userbirth = "생년월일은 YYYY.MM.DD 형식이어야 합니다.";
        }

        if (!formData.gender) {
            alert("성별을 선택해주세요.");
        }

        return newErrors;
    };
    // forcus out 시 아이디 체크
    const handleIdBlur = async () => {
        const userId = formData.userid;
        const idRegex = /^[a-z0-9]{6,20}$/;

        if (userId.trim() === '' || !idRegex.test(userId)) {
            setIdCheckError('6~20자의 영문 소문자와\n 숫자만 사용 가능합니다.');
            setIdCheckSuccess(false);
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:9988/idcheck?userid=${userId}`);
            console.log("아이디 확인 응답:", response.data); // 디버깅 로그
            if (response.data === 1) {
                setIdCheckError('사용할 수 없는 아이디입니다.');
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
        const nickRegex = /^[a-zA-Z0-9가-힣]{2,20}$/;

        if (nickname.trim() === '' || !nickRegex.test(nickname)) {
            setNickCheckError('닉네임은 2~20자의 영문자, 숫자, 한글로 구성되어야 합니다.');
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

            axios.post('http://localhost:9988/join', formDataToSend)
            .then(response => {
                console.log('Success:', response.data);
                setStep(3); // Proceed to the next step if the request is successful
            })
            .catch(error => {
                console.error('Error:', error);
                setErrors({ submit: 'There was an error submitting the form. Please try again.' });
            });
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

    // 배경 작업용
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:9988/get-masonry-images');
                const fetchedImages = response.data;

                const processedImages = await Promise.all(
                  fetchedImages.map(async (image) => {
                    const brightness = await checkImageBrightness(image.src);
                    return {
                      ...image,
                      isBright: brightness > 128,
                    };
                  })
                );
                //console.log("Processed Images:", processedImages);
                setImages(processedImages);
                setLoading(false); // 이미지 로드 완료 후 로딩 상태 변경
                // setImages(response.data);
            } catch (error) {
                console.error('이미지 불러오기 중 오류 발생:', error);
                setLoading(false); // 오류 발생 시에도 로딩 상태 변경
            }
        };
    
        fetchImages();
    }, []);
    // 체도 확인하는 작업
    const checkImageBrightness = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.crossOrigin = "Anonymous";
    
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
    
            let brightnessSum = 0;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
              brightnessSum += brightness;
            }
    
            const avgBrightness = brightnessSum / (img.width * img.height);
            //console.log(`Image URL: ${url}, Avg Brightness: ${avgBrightness}`);
            resolve(avgBrightness);
          };
        });
      };

    const breakpointColumnsObj = {
        default: 6,
        1650 : 5,   
        1150: 4,      
        860: 3,       
        500: 2,
        250 : 1
    };

    return (
        <div className="signup-background" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
             {loading ? (
                <div className="loading-overlay">
                    <div class="spinner-border text-info"></div>
                </div>
            ) : (
                <>
            {/* Masonry 배경 */}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid-background"
                columnClassName="masonry-grid-column-background"
            >
                {images.map((image, index) => (
                <div key={index} className="background-image-container">
                    
                    <img
                    src={image.srcurl}
                    alt={`Background ${index}`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        opacity: image.isBright ? 0.6 : 1 // 밝은 이미지의 경우 불투명도 낮춤
                    }}
                    />
                </div>
                ))}
            </Masonry>
             {/* 기존 Masonty */}
            {/* <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid-background"
                columnClassName="masonry-grid-column-background"
            >
                {images.map((image, index) => (
                    <div key={index} className="background-image-container">
                        <img src={image.src} alt={`Background ${index}`}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </Masonry> */}
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
                                            {idCheckError && ( <div className="error-message" style={{ maxWidth : "208px" }}> {idCheckError} </div> )}
                                            {idCheckSuccess && ( <div className="success-message" style={{ color: '#398e39' }}>사용 가능한 아이디입니다. </div> )} 
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
                                            
                                            <div className="gen">
                                                <div className={`gender-option ${formData.gender === '1' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '1' })} >
                                                    <label>남성</label>
                                                </div>
                                                <div className={`gender-option ${formData.gender === '2' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '2' })} >
                                                    <label>여성</label>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.username && <div className="error-message">{errors.username}</div>}
                                        <div className="inputclass">
                                            <input type="text" name="useremail" value={formData.useremail} onChange={handleInputChange} placeholder='이메일' />
                                            {errors.useremail && <div className="error-message">{errors.useremail}</div>}
                                        </div>
                                        <div className="inputclass">
                                            <input type="text" name="usernick" value={formData.usernick} onChange={handleInputChange} onBlur={handleNicknameBlur} placeholder='닉네임' />
                                            {nickCheckError && (
                                                <div className="error-message" style={{ color: '#ff6347', maxWidth : "256px" }}> {nickCheckError} </div>
                                            )}
                                            {nickCheckSuccess && (
                                                <div className="success-message" style={{ color: '#398e39' }}> 사용 가능한 닉네임입니다. </div>
                                            )}
                                        </div>
                                        <div className="inputclass">
                                            <input type="text" name="usertel" value={formData.usertel} onChange={handleInputChange} placeholder='전화번호' />
                                            {errors.usertel && <div className="error-message">{errors.usertel}</div>}
                                        </div>
                                        
                                        <div hidden> 
                                            <span>우편번호</span>  
                                            <input type = "text" name = "zipcode" value = ""/> 
                                        </div>
                                        <div className="inputclass">
                                            <input type="text" name="useraddr" value={formData.useraddr} onChange={handleInputChange}
                                            onClick={() => setIsAddressModalOpen(true)} placeholder='주소' readOnly/>
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
            </>
            )}
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
        </div>
    );
}

export default Signup;