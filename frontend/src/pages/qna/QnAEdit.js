import './../../css/qna/qnaEdit.css';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

function QnAEdit() {
    const [qnAEdit, setQnAEdit] = useState([]);
    const params = useParams().qna_no;
    const item = qnAEdit[0];
    const formData = useState({});
    const navigate = useNavigate();

    //수정할 데이터 객체들
    const [userid, setUserid] = useState('');
    const [privacyQ, setprivacyQ] = useState(0);
    const [qna_title, setQna_title] = useState('');
    const [qna_content, setQna_content] = useState('');
    const head_titleList = [
        { value: "1", name: "상품" },
        { value: "2", name: "사이트" },
        { value: "3", name: "기타문의" }
    ];
    const [head_title, setHead_title] = useState(0);
    const [preQpwd, setPreQpwd] = useState('');
    const [qna_pwd, setQna_pwd] = useState('');
    const [qna_state, setQna_state] = useState(1);
    const [active_state] = useState(2);
    const [qna_img, setQna_img] = useState([]);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    //데이터 불러오기
    useEffect(() => {
        axios.get(`http://localhost:9988/qna/viewEdit/${params}`)
            .then(response => {
                setQnAEdit(response.data);
                console.log(response.data);
                setPreQpwd(qna_pwd);
                setImages(`http://localhost:9988/qna/`+response.data[0].qna_img);
            });
    }, [params]);

    //카테고리 변경
    const handleHeadTitleChange = (e) => {
        console.log(head_title);
        setHead_title(e.target.value);
    };
    //비밀번호 변경
    const handleqnapwdChange = (e) => {
        setQna_pwd(e.target.value);
    }
    //비밀글 설정 변경
    const handleprivacyQChange = (e) => {
        setprivacyQ(e.target.value);
    };
    //비밀글 설정에 따라 비밀번호 저장 및 초기화
    useEffect(() => {
        if (privacyQ === '0') {
            setPreQpwd(qna_pwd);
            setQna_pwd('');
        } else if (privacyQ === '1') {
            setQna_pwd(preQpwd);
        }
    }, [privacyQ]);
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // FileList를 배열로 변환
        
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setImages(imagePreviews);
        

        // 선택한 파일 정보 콘솔에 출력
        files.forEach((file) => {
            console.log('선택한 파일:', file.name);
            console.log('선택한 파일:',file);
            setQna_img(file); // 상태에 파일 저장
        });
        
        console.log("qna_img:"+files[0]);
        
    };
    // console.log("qna_img:"+);
    //이미지 input 대체 핸들러
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 숨겨진 input을 클릭하는 동작
        } else {
            console.error("fileInputRef가 아직 초기화되지 않았습니다.");
        }
    };

    //데이터 호출하여 아이템 등록시 밸류로 설정
    useEffect(() => {
        if (item?.qna_title) {
            setQna_title(item.qna_title);
        }
        if (item?.qna_content) {
            setQna_content(item.qna_content);
        }
        if (item?.head_title) {
            setHead_title(item.head_title);
        }
        if (item?.privacyQ) {
            setprivacyQ(item.privacyQ);
        }
        if (item?.privacyQ != 1) {
            setQna_pwd('');
        } else {
            setQna_pwd(item.qna_pwd);
        }
        if (item?.qna_pwd) {
            setQna_pwd(item.qna_pwd);
        }
        if (item?.qna_state) {
            setQna_state(item.qna_state);
        }

    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const editData = {
            userid: userid,
            qna_title: qna_title,
            qna_content: qna_content,
            head_title: head_title,
            privacyQ: privacyQ,
            qna_pwd: privacyQ === '1' ? qna_pwd : null,
            qna_state: qna_state,
            active_state: active_state,
        };
    
        const formData = new FormData();
        formData.append("qna_img", qna_img);  // 파일을 추가
        formData.append("editData", new Blob([JSON.stringify(editData)], { type: "application/json" }));
        
            console.log('FormData 확인:');
            formData.forEach((value, key) => {
                console.log(key, value);
            });
    
        if (!qna_title) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!qna_content) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!head_title) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (privacyQ === '1' && (qna_pwd.trim().length < 4)) {
            alert('비밀번호를 반드시 4자리로 입력하세요.');
            return;
        }
    
        console.log("hihi");

        // 데이터 폼으로 보내기
        axios.post(`http://localhost:9988/qna/viewEditOk/${params}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(() => {
            console.log(formData);
            console.log('수정 성공');
            navigate(`/qna/view/${params}`);
        })
        .catch(error => {
            console.error('수정 실패', error);
            alert('수정 실패하였습니다.');
        });
    };


    return (
        <div className="QnAEditBody">
            <form onSubmit={handleSubmit} className="QnAEditform">
                <div className="container">
                    <h1>질의응답(QnA) 수정</h1>
                    <hr />
                    <div className="qna_titleArea">
                        {/* 제목 */}
                        <div>
                            <input type="text" className="qna_title"
                                id="qna_title"
                                placeholder="제목을 입력하세요"
                                value={qna_title}
                                onChange={(e) => setQna_title(e.target.value)}
                                name="email" />
                        </div>
                        {/* 카테고리 */}
                        <div>
                            <select
                                className='head_title'
                                name='head_title'
                                value={head_title}
                                onChange={handleHeadTitleChange}
                            >
                                {head_titleList.map((item) => {
                                    return <option value={item.value} key={item.value}>
                                        {item.name}
                                    </option>
                                })}
                            </select>
                        </div>
                    </div>
                    {/* 글내용 */}
                    <textarea
                        className="qna_content"
                        rows="7"
                        id="qna_content"
                        placeholder="내용을 입력하세요"
                        value={qna_content}
                        onChange={(e) => setQna_content(e.target.value)}
                        name="qna_content"></textarea>
                    {/* 비밀글 설정 */}
                    <div className='privacy-select'>
                        <label className="qna-radio-label">
                            <input
                                type='radio'
                                name='privacy'
                                value='0'
                                checked={privacyQ === '0'}
                                onChange={handleprivacyQChange}
                            /> <span className="qna-custom-radio">공개글</span>
                        </label>
                        <label className="qna-radio-label">
                            <input
                                type='radio'
                                name='privacy'
                                value='1'
                                checked={privacyQ === '1'}
                                onChange={handleprivacyQChange}
                            /> <span className="qna-custom-radio">비밀글</span>
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
                        {/* 이미지 목록 */}
                        <div className="imgUploader-box">
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div onClick={handleImageClick} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', display: 'inline-block' }}>
                        이미지 수정하기
                    </div>

                    <div className='image-preview'>
                        {images=='http://localhost:9988/qna/null'?
                            (<img src={images} style={{ width:'50%',height:'auto', marginTop:'10px', objectFit: 'contain', display:'none'}}
                            className="film-strip" />):                            
                            (<img src={images} style={{ width:'50%',height:'auto', marginTop:'10px', objectFit: 'contain',display:'block' }}
                            className="film-strip" />)}
                    </div>
                </div>
                    </div>
                    <div className='right-buttons'>
                        <button type='submit'>문의 저장</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default QnAEdit;