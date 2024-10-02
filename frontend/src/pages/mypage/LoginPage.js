import axios from '../../component/api/axiosApi';
//import axios from 'axios';
import '../../css/mypage/loginpage.css';
import { useState } from 'react';

function LoginPage() {
  const [userid, setUserid] = useState('');
  const [userpwd, setUserpwd] = useState('');

  // login 함수 정의
  const login = async (loginData) => {
    try {
      console.log(loginData);
      const response = await axios.post("http://localhost:9988/login", loginData);

      // 성공적인 응답 처리
      const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
      
      if (authorizationHeader) {
        const pureToken = authorizationHeader.split(' ')[1];

        // localStorage에 토큰 저장
        window.localStorage.setItem("token", pureToken);
        //window.localStorage.setItem("isAdmin", response.data.isAdmin);
        //window.localStorage.setItem("refresh", response.data.refresh);

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

    // loginData 생성
    const loginData = new FormData();
    loginData.append("userid", userid);
    loginData.append("userpwd", userpwd);


    // login 함수 호출
    login(loginData)
      .then((response) => {
        console.log('Login successful:', response.data);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <div className="loginpage">
      <div className="container">
        <div className="loginsession">
          <div>
            <span>로그인</span>
            <a href="#">비밀번호를 잊어버리셨나요?</a>
          </div>
          <form name="loginCheck" onSubmit={handleLogin}>
            <input
              type="text" id="userid" value={userid} placeholder='아이디' 
              onChange={(e) => setUserid(e.target.value)}
            />
            <input
              type="password" id="userpwd" placeholder="비밀번호"
              value={userpwd}
              onChange={(e) => setUserpwd(e.target.value)}
            />
            <button type="submit">로그인하기</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
