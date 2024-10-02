import './../../css/qna/qnaWrite.css';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../component/api/axiosApi';

function QnAWrite(){
    const [userid, setUserid]=useState('');
    const [privacyQ, setprivacyQ] = useState('0'); // 공개 여부
    const [qna_title, setQna_title] = useState(''); // 질문 제목
    const [qna_content, setQna_content] = useState(''); // 질문 내용
    const [head_title, setHead_title] = useState(''); // 카테고리
    const [qna_pwd, setQna_pwd] = useState(''); // 비밀글 설정 시 비밀번호
    const [qna_state] = useState(0); // 질문 상태 (디폴트 값)
    const [active_state]=useState(1);
    const [qna_img, setQna_img] = useState([]);

    useEffect(() => checkId(),[])
    
    function checkId(){
    axios.get('http://localhost:9988/user/userinfo')
    .then(response => {
        console.log(response.data);
        setUserid(response.data);
    })
    .catch(error => {
        console.error('데이터 로드 중 오류 발생:', error);
    })
    }

    const navigate = useNavigate();

    const handleprivacyQChange = (e) => {
        setprivacyQ(e.target.value);
    };

    const handleImageChange = (e) => {
        
        const files = Array.from(e.target.files); // FileList를 배열로 변환
        setQna_img(files); // 상태에 파일 저장
    
        // 선택한 파일 정보 콘솔에 출력
        files.forEach((file) => {
            console.log('선택한 파일:', file.name);
        });
    };
    const handleHeadTitleChange = (e) => {
        setHead_title(e.target.value);
    };
    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 서버로 전송할 데이터 객체 생성
        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('qna_title', qna_title);
        formData.append('qna_content', qna_content);
        formData.append('head_title', head_title);
        formData.append('privacyQ', privacyQ);
        formData.append('qna_pwd', privacyQ === '1' ? qna_pwd : null);
        formData.append('qna_state', qna_state);
        formData.append('active_state', active_state);

        qna_img.forEach((img, index) => {
            formData.append(`qna_img`, img);
        });

        if (privacyQ === '1' && (qna_pwd.trim().length < 4)) {
            alert('비밀번호를 반드시 4자리로 입력하세요.');
            return;
        }

        axios.post('http://localhost:9988/qna/writeOk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            if (response.data == 3 || response.data == 2) {
                alert('질문 등록에 실패하였습니다.');
                return false;
            } else if (response.data == 0) {
                console.log('잘못된 폼데이터 등록');
                alert('잘못된 양식입니다.');
                return false;
            } else {
                console.log('질문이 성공적으로 등록되었습니다:', response.data);
                navigate(`/qna`);
            }
        })
            .catch((error)=>{
                console.error('질문 등록 실패',error);
            });

    };
    return(
        <div className='QnAWriteBody'>
        <div className='container mt-3'>
            <h1>질의응답(QnA) 작성</h1>
            <hr />
            <form className='QnAWriteform' onSubmit={handleSubmit}>
                <div className='qna_titleArea'>
                    <input type='hidden'
                        name='userid'
                        onChange={(e) => setUserid(e.target.value)}
                        value={userid} />
                    <div>제목</div>
                    <div>
                        <input
                            type='text'
                            className='qna_title'
                            value={qna_title}
                            onChange={(e) => setQna_title(e.target.value)}
                            placeholder='제목을 입력해 주세요' />
                    </div>
                    <div>
                        <select
                            className='head_title'
                            name='head_title'
                            value={head_title}
                            onChange={handleHeadTitleChange}
                        >
                            <option value='' disabled hidden>카테고리 선택</option>
                            <option value='1'>상품</option>
                            <option value='2'>사이트</option>
                            <option value='3'>기타문의</option>
                        </select>
                    </div>
                </div>
                <textarea
                    className='qna_content'
                    value={qna_content}
                    onChange={(e) => setQna_content(e.target.value)}
                    placeholder='문의 내용을 입력해 주세요.'
                ></textarea>
                <div className='privacy-select'>
                    <input
                        type='radio'
                        name='privacy'
                        value='0'
                        checked={privacyQ === '0'}
                        onChange={handleprivacyQChange}
                    /> 공개글 &nbsp;
                    <input
                        type='radio'
                        name='privacy'
                        value='1'
                        checked={privacyQ === '1'}
                        onChange={handleprivacyQChange}
                    /> 비밀글
                    {privacyQ === '1' && (
                        <div>
                            <input
                                type='text'
                                placeholder='비밀번호를 설정하세요(숫자 4자리)'
                                maxLength='4'
                                value={qna_pwd}
                                onChange={(e) => setQna_pwd(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div>
                <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageChange}
                />
                </div>
                <input type='hidden' id='qna_state' value={qna_state} />
                <div className='right-buttons'>
                    <button type='submit'>등록</button>
                </div>
            </form>
        </div>
    </div>
    );
}

export default QnAWrite;