import './../../css/qna/qnaEdit.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

function QnAEdit(){
    const [qnAEdit, setQnAEdit]=useState([]);
    const params=useParams().qna_no;
    const item=qnAEdit[0];
    const formData=useState({});
    const navigate = useNavigate();

    //수정할 데이터 객체들
    const [userid, setUserid]=useState('');
    const [privacyQ, setprivacyQ] = useState('');
    const [prepri, setPrepri]=useState('');
    const [qna_title, setQna_title]=useState('');
    const [qna_content, setQna_content]=useState('');
    const head_titleList = [
        {value: "1", name:"상품"},
        {value: "2", name:"사이트"},
        {value: "3", name:"기타문의"}
    ];
    const [head_title, setHead_title]=useState("");
    const [qna_pwd, setQna_pwd] = useState('');
    const [qna_state, setQna_state] = useState('1');
    const [active_state]=useState('2');

    //데이터 불러오기
    useEffect(() => {
        axios.get(`http://localhost:9988/qna/viewEdit/${params}`)
            .then(response => {
                setQnAEdit(response.data);     
                console.log(response.data);      
            });
    }, [params]);

    //카테고리 변경
    const handleHeadTitleChange = (e) => {
        console.log(head_title);
        setHead_title(e.target.value);
    };
    //비밀글 설정 변경
    const handleprivacyQChange = (e) => {
        setprivacyQ(e.target.value);
        console.log(privacyQ);
    };
        
    //데이터 호출하여 아이템 등록시 밸류로 설정
    useEffect(() => {
        if (item?.qna_title) {
          setQna_title(item.qna_title);
        }
        if (item?.qna_content) {
          setQna_content(item.qna_content);
        }
        if(item?.head_title){
            setHead_title(item.head_title);
        }
        if(item?.privacyQ){
            setprivacyQ(item.privacyQ);
            setPrepri(item.privacyQ);
        }
        if(item?.qna_pwd){
            setQna_pwd(item.qna_pwd);
        }
        if(item?.qna_state){
            setQna_state(item.qna_state);
        }

      }, [item]);

    //글 수정
    const handleSubmit = (e) => {
        e.preventDefault();
    const formData={
        'qna_title':qna_title,
        'qna_content':qna_content,
        'head_title':head_title,
        'privacyQ':privacyQ,
        'qna_pwd':privacyQ==='1' ? qna_pwd:null,
        'qna_state':qna_state,
        'active_state':active_state
    }
    console.log('FormData 확인:',formData);

    if(!qna_title){
        alert("제목을 입력해주세요.");
        return;
    }
    if(!qna_content){
        alert("내용을 입력해주세요.");
        return;
    }
    if(!head_title){
        alert("카테고리를 선택해주세요.");
        return;
    }
    if (privacyQ === '1' && (qna_pwd.trim().length < 4)) {
        alert('비밀번호를 반드시 4자리로 입력하세요.');
        return;
    }
    axios.post(`http://localhost:9988/qna/viewEditOk/${params}`, formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(() => {
        console.log('수정 성공');
        navigate(`/qna/view/${params}`);
    })
    .catch(error => {
        console.error('수정 실패', error);
        alert('수정 실패하였습니다.');
    });
    
    };


    return(
        <div className="QnAEditBody">
            <div className="container">
                <h1>질의응답(QnA) 수정</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="mt-3">
                    {/* 카테고리 */}
                    <label htmlFor="head_title" className="form-label">카테고리:</label>
                    <select
                        className='head_title_css form-control'
                        name='head_title'
                        value={head_title}
                        onChange={handleHeadTitleChange}
                    >
                        <option value='' disabled hidden>카테고리 선택</option>
                        {head_titleList.map((item)=>{
                            return <option value={item.value} key={item.value}>
                                {item.name}
                        </option>
                        })}
                    </select>
                    {/* 제목 */}
                    <label htmlFor="qna_title" className="form-label">제목:</label>
                    <input type="text" className="form-control"
                        id="qna_title"
                        placeholder="제목을 입력하세요"
                        value={qna_title}
                        onChange={(e)=>setQna_title(e.target.value)}
                        name="email"/>
                    {/* 글내용 */}
                    <label htmlFor="comment">글 내용:</label>
                    <textarea
                        className="form-control"
                        rows="7"
                        id="qna_content"
                        placeholder="내용을 입력하세요"
                        value={qna_content}
                        onChange={(e)=>setQna_content(e.target.value)}
                        name="qna_content"></textarea>
                    {/* 비밀글 설정 */}
                    <div className='privacy-select'>
                    <input
                        type='radio'
                        name='privacy'
                        value='0'
                        checked= {privacyQ == 0}
                        onChange={handleprivacyQChange}
                    /> 공개글 &nbsp;
                    <input
                        type='radio'
                        name='privacy'
                        value='1'
                        checked={privacyQ == 1}
                        onChange={handleprivacyQChange}
                    /> 비밀글
                    {privacyQ == 1 && (
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
                    
                    <div className='right-buttons'>
                        <button type='submit'>수정 완료</button>
                    </div>
                     </div>
                </form>

            </div>
        </div>
    );
}

export default QnAEdit;