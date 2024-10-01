import './../../css/qna/qnaWrite.css';

import React, { useState } from 'react';



function QnAWrite(){
    const [privacyT, setPrivacyT] = useState("0"); 

    const handlePrivacyTChange = (event) => {
        setPrivacyT(event.target.value); 
    };

    return(
        <div className="QnAWriteBody">
            <div className="container mt-3">
                <h1>질의응답(QnA) 작성</h1>
                <hr />
                <form className="QnAWriteform">
                    <div className="qna_titleArea">
                        <div>제목</div>
                        <div>
                            <input type="text" id="qna_title" placeholder="제목을 입력해 주세요"/>
                        </div>
                        <div>
                            <select id="head_title" name="head_title">
                                <option value="" selected disabled hidden>카테고리 선택</option>
                                <option>상품</option>
                                <option>사이트</option>
                                <option>기타문의</option>
                            </select>
                        </div>
                    </div>
                    <textarea id="qna_content" placeholder="문의 내용을 입력해 주세요."></textarea>
                    <div className="privacy-select">
                        <input type="radio"  name="privacy" value="0" checked={privacyT === "0"}
                            onChange={handlePrivacyTChange}/>공개글 &nbsp;
                        <input type="radio" name="privacy" value="1"checked={privacyT === "1"}
                            onChange={handlePrivacyTChange}/>비밀글
                    {privacyT==='1'&&(
                        <div>
                            <input type="text" placeholder="비밀번호를 설정하세요(숫자 4자리)" maxLength="4"/>
                        </div>
                    )}
                    </div>
                    <div className="right-buttons">
                        <button>등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default QnAWrite;