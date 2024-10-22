import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/resetpassword.css';
import useBackgroundImage from '../../component/useBackgroundImage';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');  // 이메일 링크에서 전달받은 토큰 값
  useBackgroundImage();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

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

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
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
        // 백엔드로 POST 요청
        const response = await axios.post('http://localhost:9988/user/reset-password', {
          newPassword: formData.newPassword,
          token: token  // JWT 토큰을 함께 전송
        });
        console.log(response.data);
        alert('비밀번호가 성공적으로 재설정되었습니다.');
        navigate('/signin');  // 비밀번호 재설정 후 로그인 페이지로 이동
      } catch (error) {
        console.error("비밀번호 재설정 실패", error);
        if (error.response && error.response.data === "JWT가 만료되었습니다.") {
            setErrors({ submit: '비밀번호 설정 가능 시간이 초과하였습니다.' });
            } else {
            setErrors({ submit: '비밀번호 재설정 중 오류가 발생했습니다.' });
            }
      }
    }
  };

  return (
    <div className="resetPage">
      <div className="container">
        <h2>비밀번호 재설정</h2>
        <form className = "resetform" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          <div className='rest_button'>
          <button type="submit" className="btn btn-primary">비밀번호 재설정</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
