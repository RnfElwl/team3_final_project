import react, { useState } from 'react';
import '../../css/mypage/loginpage.css';
import axios from 'axios';
function LoginPage() {

  return (
      <div class = "loginpage">
        <div class = "container">
          <div class = "loginsession">
            <div>
              <span>로그인</span>
              <a>비밀번호를 잊어버리셨나요?</a>
            </div>
            <form>
              <input type = "text" id = "userid" placeholder='아이디'/>
              <input type = "password" id = "userpwd" placeholder='비밀번호'/>
              <button type = "submit">로그인하기</button>
            </form>
          </div>
        </div>
      </div>
    
  );
}

export default LoginPage;