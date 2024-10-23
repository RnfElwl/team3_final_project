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
      const result = await axios.post("http://localhost:9988/user/checkban", loginData);
  
      if (result.data.banned) {
        // 정지된 경우
        alert(`정지 기간입니다. 정지 해제 날짜: ${result.data.banEndDate}`);
        return { status: 'banned' };
      } else if (result.data.deleted === 0) {
        // 탈퇴한 회원인 경우
        alert('탈퇴한 회원입니다.');
        return { status: 'deleted' };  // 이미 메시지를 출력했으므로 추가 메시지 처리 없음
      } else {
        // 정지되지 않았고, 탈퇴한 회원도 아닌 경우 로그인 처리
        const response = await axios.post("http://localhost:9988/login", loginData);  // 로그인 요청
  
        // lastvisite 업데이트
        const updateResponse = await axios.post("http://localhost:9988/user/updatevisite", loginData);
        if (updateResponse.data !== 1) {
          alert('마지막 방문 기록 업데이트 실패. 다시 시도해주세요.');
          return { status: 'error', message: 'Failed to update last visit timestamp.' };
        }
  
        // 토큰 저장
        const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
        if (authorizationHeader) {
          const pureToken = authorizationHeader.split(' ')[1];
          window.localStorage.setItem("token", pureToken);
          window.localStorage.setItem("refresh", response.data.refresh);
        }
  
        return { status: 'success', data: response };
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;  // 에러 상위로 전달
    }
  };
  
  // 폼 제출 처리
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    // 유효성 검사 호출
    const errors = validateLogin(userid, userpwd);
    const loginData = new FormData();
  
    if (errors) {
      setErrorMessage(errors);
      return false;
    } else {
      loginData.append("userid", userid);
      loginData.append("userpwd", userpwd);
    }
  
    // 로그인 요청
    login(loginData)
      .then((response) => {
        if (response.status === 'success') {
          console.log('Login successful:', response.data);
          alert("로그인 성공");
          window.location = "/";
        } else if (response.status === 'banned') {
          // 정지된 경우 처리
          return;
        } else if (response.status === 'deleted') {
          // 탈퇴한 회원 처리 (이미 처리되었으므로 추가 처리 없음)
          return;
        }
      })
      .catch((error) => {
        alert("로그인 실패");
        console.error('Login failed:', error);
      });
  };
  


  const [backimage, setBackimage] = useState([]);

  async function fetchUsers() {
      try {
          const response = await axios.get('http://localhost:9988/user/imageworking', {
              responseType: 'blob',
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
  const openPopupId = (e) => {
    e.preventDefault();
    const width = 340;
    const height = 480;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "find/id",
      "popupWindow",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const openPopupPw = (e) => {
    e.preventDefault();
    const width = 400;
    const height = 480;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "find/password",
      "popupWindow",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="loginpage">
      <div className="container">
        <div className="loginsession">
          <div>
            <span>로그인</span>
            <div id = "find_idpw">
              <span onClick={openPopupId}>아이디 찾기</span>
              <span >/</span>
              <span onClick={openPopupPw}>비번 찾기</span>
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
