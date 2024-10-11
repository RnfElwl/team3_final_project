import axios from '../../component/api/axiosApi';
//import axios from 'axios';
import '../../css/mypage/loginpage.css';
import { useState, useEffect } from 'react';
import kakaoIcon from '../../img/kakao_social.png';
import googleIcon from '../../img/google_social.png';
import { validateLogin } from '../../component/Validation';
import { downloadExcelFile } from '../../component/api/fileDownload';

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

  const [backimage, setBackimage] = useState([]);

  async function fetchUsers() {
      try {
          const response = await axios.get('http://localhost:9988/user/imageworking', {
              responseType: 'blob', // 이미지 데이터를 blob 형태로 받기
          });
          const imageObjectURL = window.URL.createObjectURL(response.data);
          console.log(imageObjectURL);
          setBackimage(imageObjectURL);
      } catch (error) {
          console.error("Error fetching user data", error);
      }
    }

  useEffect(() => {
    fetchUsers();
    // 컴포넌트가 처음 렌더링된 후 실행되는 코드
    const element = document.getElementsByClassName('Header');
    const loginButton = element[0].querySelector('.login_btn');
    if (element.length > 0) {
      element[0].style.backgroundColor = 'transparent'; // 첫 번째 요소의 배경색을 투명하게 설정
      loginButton.style.backgroundColor = 'transparent';
    }
    return () => {
      element[0].style.backgroundColor = 'black';
      loginButton.style.backgroundColor = 'black';
      setBackimage("null");
    };
}, []);
  useEffect(() => {
    const root = document.getElementById('root');
    const img = document.createElement('img');
    img.src = `${backimage}`; // 이미지 경로 설정
    console.log(img, backimage);
    img.className = 'login-background';
    root.appendChild(img);
    //console.log(img);
    return () => {
      // root에서 img 요소 제거
      const imgToRemove = root.querySelector('img.login-background');
      if (imgToRemove) {
        root.removeChild(imgToRemove);
      }
    };
  }, [backimage]);

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
              <button className="btn btn-outline-light text-dark text-white-50" onClick={() => window.location.href = '/signup'}>회원가입</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
