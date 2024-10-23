import './../../css/qna/qnaWrite.css';

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../component/api/axiosApi';

function QnAWrite() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [privacyQ, setPrivacyQ] = useState('0'); // 공개 여부
    const [qna_title, setQna_title] = useState(''); // 질문 제목
    const [qna_content, setQna_content] = useState(''); // 질문 내용
    const head_titleList = [
        { value: '1', name: '영화' },
        { value: '2', name: '사이트' },
        { value: '3', name: '기타문의' }
    ];
    const [head_title, setHead_title] = useState('');
    const [qna_pwd, setQna_pwd] = useState(''); // 비밀글 설정 시 비밀번호
    const [qna_state] = useState(0); // 질문 상태 (디폴트 값)
    const [active_state] = useState(1);
    const [qna_img, setQna_img] = useState([]);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => checkId(), [])
    function checkId() {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                console.log(response.data);
                setUserid(response.data);
            })
            .catch(error => {
                console.error('데이터 로드 중 오류 발생:', error);
            })
    }
    //훅 사용: 경고 메시지 전달
    // useUnsavedChangesWarning(isDirty, '변경사항이 저장되지 않았습니다. 정말 떠나시겠습니까?');

    //비밀글 설정 핸들러
    const handleprivacyQChange = (e) => {
        setPrivacyQ(e.target.value);
    };
    //이미지 설정 핸들러
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // FileList를 배열로 변환
        setQna_img(files); // 상태에 파일 저장
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setImages(imagePreviews);

        // 선택한 파일 정보 콘솔에 출력
        files.forEach((file) => {
            console.log('선택한 파일:', file.name);
        });
    };
    //이미지 input 대체 핸들러
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 숨겨진 input을 클릭하는 동작
        } else {
            console.error("fileInputRef가 아직 초기화되지 않았습니다.");
        }
    };
    //카테고리 핸들러
    const handleHeadTitleChange = (e) => {
        console.log(head_title);
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

        console.log('FormData 확인:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        if (!qna_title) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!qna_content) {
            alert('내용을 입력해주세요.');
            return;
        }
        if (!head_title) {
            alert('카테고리를 선택해주세요.');
            return;
        }
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
                    // setIsDirty(false);
                    navigate(`/qna`);
                }
            })
            .catch((error) => {
                console.error('질문 등록 실패', error);
            });

    };
    return (
        <div className='QnAWriteBody'>
            <form className='QnAWriteform' onSubmit={handleSubmit}>
                <h2 style={{textAlign:"left", marginTop:"30px"}}>질의응답(QnA) 작성</h2>
                <hr />
                <div className='qna_titleArea'>
                    <input type='hidden'
                        name='userid'
                        value={userid} />
                                    <div>
                        <select
                            className='head_title'
                            name='head_title'
                            value={head_title}
                            onChange={handleHeadTitleChange}
                        >
                            <option value='' disabled hidden>카테고리 선택</option>
                            {head_titleList.map((item) => {
                                return <option value={item.value} key={item.value}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                    </div>
                    <div>
                        <input
                            type='text'
                            className='qna_title'
                            value={qna_title}
                            onChange={(e) => {
                                setQna_title(e.target.value)
                                // setIsDirty(true);
                            }}
                            placeholder='제목을 입력해 주세요' />
                    </div>
                </div>
                <textarea
                    className='qna_content'
                    value={qna_content}
                    onChange={(e) => setQna_content(e.target.value)}
                    placeholder='문의 내용을 입력해 주세요.'
                ></textarea>
                {/* 비밀글 설정 */}
                <div className='privacy-select'>
                    <label className="qna-radio-label">
                        <input
                            type='radio'
                            name='privacy'
                            value='0'
                            checked={privacyQ === '0'}
                            onChange={handleprivacyQChange}
                        /> <span class="qna-custom-radio">공개글</span>
                    </label>
                    <label className="qna-radio-label">
                        <input
                            type='radio'
                            name='privacy'
                            value='1'
                            checked={privacyQ === '1'}
                            onChange={handleprivacyQChange}
                        /> <span class="qna-custom-radio">비밀글</span>
                    </label>
                    {privacyQ === '1' && (
                        <div className="qna_pwd_box">
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
                <div className="imgUploader-box">
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div onClick={handleImageClick} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', display: 'inline-block' }}>
                        이미지 업로드하기
                    </div>
                    <div className='image-preview'>
                        {images.map((image, index) => (
                            <img key={index} src={image} alt={`preview-${index}`} style={{ width:'50%',height:'auto', marginTop:'10px', objectFit: 'contain'}}
                            className="film-strip" />
                        ))}
                    </div>
                </div>
                <input type='hidden' id='qna_state' value={qna_state} />
                <div className='qw-right-buttons'>
                    <button
                        type='submit'
                    >등록</button>
                </div>
            </form>
        </div>
    );
}

export default QnAWrite;