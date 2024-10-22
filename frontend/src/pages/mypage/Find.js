import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/find.css';

function Find() {
    const { type } = useParams();
    const [formData, setFormData] = useState({
        userid: '',
        username: '',
        useremail: '',
        type: type
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();  // 페이지 이동을 위한 훅
    const [foundId, setFoundId] = useState(''); // 아이디 찾기 결과 저장
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 설정

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (type === "password" && !formData.userid.trim()) {
            newErrors.userid = "아이디를 입력해 주세요.";
        }
        if (!formData.username.trim()) {
            newErrors.username = "이름을 입력해 주세요.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.useremail.trim()) {
            newErrors.useremail = "이메일을 입력해 주세요.";
        } else if (!emailRegex.test(formData.useremail)) {
            newErrors.useremail = "유효한 이메일 주소를 입력해 주세요.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                // 서버로 POST 요청 보내기
                const response = await axios.post('http://localhost:9988/user/find', formData);
                console.log(response.data);
                if (type === "id") {
                    // 아이디 찾기 요청 성공 시, success 페이지로 이동하면서 아이디 전달
                    navigate('/success', { state: { foundId: response.data.userid } });
                } else {
                    // 비밀번호 재설정일 경우 success 페이지로 이동하면서 메시지 전달
                    navigate('/success', { state: { message: "비밀번호 재설정 링크가 전송되었습니다." } });
                }
            } catch (error) {
                console.error("폼 제출 실패", error);
                if (error.response && error.response.status === 400) {
                    // 400 에러일 경우
                    setErrors({ submit: '일치하는 정보가 없습니다.' });
                } else {
                    setErrors({ submit: '서버와의 통신 중 오류가 발생했습니다.' });
                }
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            // 비밀번호 변경 요청
            const response = await axios.post('http://localhost:9988/user/reset-password', {
                userid: formData.userid,
                newPassword
            });
            console.log("비밀번호 재설정 성공", response.data);
            // 비밀번호 재설정 완료 메시지를 보여줄 수 있음
        } catch (error) {
            console.error("비밀번호 재설정 실패", error);
            setErrors({ submit: '비밀번호 재설정 중 오류가 발생했습니다.' });
        }
    };

    useEffect(() => {
        setFormData({
            userid: '',
            username: '',
            useremail: '',
            type: type
        });
        setErrors({});
        setFoundId(''); // 아이디 결과 초기화
        setNewPassword(''); // 새 비밀번호 초기화
    }, [type]);

    return (
        <div className="Find">
            <div className="container">
                <div className="findTitle">
                    <span>{type === "id" ? "아이디" : "비밀번호"} 찾기</span>
                </div>
                    // 폼이 제출되지 않았을 때는 폼을 보여줌
                    <form onSubmit={handleSubmit}>
                        <div className="findContent">
                            {type === "password" && (
                                <div className="findinput">
                                    <input 
                                        type="text" 
                                        name="userid" 
                                        placeholder="아이디" 
                                        value={formData.userid} 
                                        onChange={handleChange} 
                                    />
                                    {errors.userid && <div className="error-message">{errors.userid}</div>}
                                </div>
                            )}

                            <div className="findinput">
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder="이름" 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                />
                                {errors.username && <div className="error-message">{errors.username}</div>}
                            </div>

                            <div className="findinput">
                                <input 
                                    type="text" 
                                    name="useremail" 
                                    placeholder="이메일" 
                                    value={formData.useremail} 
                                    onChange={handleChange} 
                                />
                                {errors.useremail && <div className="error-message">{errors.useremail}</div>}
                            </div>

                            {errors.submit && <div className="error-message">{errors.submit}</div>}

                            <div className='sub_button'>
                                <button className="btn btn-secondary" type="button" onClick={() => window.close()}>취소</button>
                                <button className="btn btn-primary" type="submit">다음</button>
                            </div>
                        </div>
                    </form>
                <hr/>
                <div className="linkto">
                    <Link to="/find/id"><span>아이디찾기</span></Link>
                    <span> / </span>
                    <Link to="/find/password"><span>비밀번호찾기</span></Link>
                </div>
            </div>
        </div>
    );
}

export default Find;
