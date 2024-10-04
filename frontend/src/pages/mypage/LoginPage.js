import axios from '../../component/api/axiosApi';
import axios2 from 'axios';
import '../../css/mypage/loginpage.css';
import { useState } from 'react';
import kakaoIcon from '../../img/kakao_social.png';
import googleIcon from '../../img/google_social.png';
import { validateLogin } from '../../component/Validation';

function LoginPage() {
  const [userid, setUserid] = useState('');
  const [userpwd, setUserpwd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // login 함수 정의
  const login = async (loginData) => {
    try {
      console.log(loginData);
      const response = await axios.post("http://localhost:9988/login", loginData);  // 로컬로 할시 본인 컴퓨터로 인식
      //const response = await axios.post("http://192.168.1.88:9988/login", loginData);
      
      // 성공적인 응답 처리
      const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
      
      if (authorizationHeader) {
        const pureToken = authorizationHeader.split(' ')[1];

        // localStorage에 토큰 저장
        window.localStorage.setItem("token", pureToken);
        //window.localStorage.setItem("isAdmin", response.data.isAdmin);
        window.localStorage.setItem("refresh", response.data.refresh);

      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // 에러 상위로 전달
    }
  };

  // 폼 제출 처리
  const handleLogin = (e) => {
    e.preventDefault(); // 페이지 리프레시 방지
    setErrorMessage(''); // 오류 메시지 초기화

    // 유효성 검사 호출
    const errors = validateLogin(userid, userpwd);
    // 유효성 검사 통과시 만들 폼
    const loginData = new FormData();
    
    if (errors) {
        setErrorMessage(errors);
        return false;
    } else {
        // loginData 생성
        loginData.append("userid", userid);
        loginData.append("userpwd", userpwd);
    }
    
    // login 함수 호출
    login(loginData)
      .then((response) => {
        console.log('Login successful:', response.data);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };
  // 엑셀 다운받는 axios
  const downloadExcelFile = async () => {
    try {
        const response = await axios.get('http://localhost:9988/movie_info', {
            responseType: 'blob', // blob으로 응답을 받도록 설정
        });

        // blob 데이터를 사용하여 파일 생성
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'movies.xlsx'); // 다운로드할 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 링크 제거
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};

  return (
    <div className="loginpage">
      <div className="container">
        <div className="loginsession">
          <div>
            <span>로그인</span>
            <div id = "find_idpw">
              <a href = "#">아이디 찾기</a>
              <a >/</a>
              <a href= "#">비번 찾기</a>
            </div>
          </div>
          <form name="loginCheck" onSubmit={handleLogin}>
            <input type="text" id="userid" value={userid} placeholder='아이디' 
              onChange={(e) => setUserid(e.target.value)}
            />
            <input type="password" id="userpwd"  value={userpwd} placeholder="비밀번호"
              onChange={(e) => setUserpwd(e.target.value)}
            />
            {errorMessage && (
                <div style={{ color: 'red' }}>
                    {errorMessage.split('\n').map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
            )}
            <button type="submit" disabled={!userid || userpwd.length < 5}>로그인하기</button>
          </form>
          <div id = "extra_info">
            <div id = "social_login">
              <span>다른방법으로 로그인</span>
              <div id = "social_type">
                <button className = "social_icon" onClick={downloadExcelFile}>
                  <img src={kakaoIcon} alt="Kakao" />
                </button>
                <button className = "social_icon">
                  <img src={googleIcon} alt="Google" />
                </button>
              </div>
            </div>
            <div id = "join_button">
              <button className="btn btn-outline-light text-dark text-white-50" onClick={() => window.location.href = '/singup'}>회원가입</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
