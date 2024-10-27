import './../../css/admin/adminNoticeCon.css'


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsExclamationCircle } from "react-icons/bs";
import axios from '../../component/api/axiosApi';
import Modal from '../../component/api/Modal';

function Notice() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("공지 등록 폼");
    const [searchKey, setSearchKey] =useState('qnotice_title');
    const [searchWord, setSearchWord]=useState('');
    const [writeForm, setWriteForm] = useState({});
    const [qNotice, setQNotice]=useState([]);



    const handlesearchKeyChange = (e) => { //검색키 처리
      console.log(e.target.value)
      setSearchKey(e.target.value);
  };

    async function writeBtnClick(no) {
        try {
            await axios.get(`http://localhost:9988/api/qnaNotices/`);
        } catch (e) {
            console.log(e);
        }
        setIsModalOpen(true);
    }

    //등록폼 핸들러
    function changeWriteForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setWriteForm((p)=>{return {...p, [idField]:idValue}});
        console.log(writeForm);
    }

    //등록폼
    async function qnotice_WriteForm(e){
      e.preventDefault();
      console.log(writeForm)
      try{
          const {data} = await axios.post("http://localhost:9988/admin/qNotice/write", writeForm ,{
              headers: {
                'Content-Type': 'application/json'
              }
            });
          if(data===1){
              setIsModalOpen(false);
              getQNoticeList();
          }
      }catch(e){
          console.log(e);
      }

    }

    //목록 호출
    async function getQNoticeList(){
      try{
          const {data} = await axios.get(`http://localhost:9988/admin/qNoticeList`, {params:{
              searchKey,
              searchWord
          }});
          setQNotice(data);
      }catch(e){
          console.log(e);
      }
  }
  useEffect(()=>{
    getQNoticeList();
}, []);


    return (
        <div className="noticeBody">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} title={modalTitle} className="insert_form">
            {true ? ( 
              <form onSubmit={qnotice_WriteForm}>
                <div className='edit_input'>
                  <div className='noticeTitle'>
                    <span>제목</span> 
                    <input type='text' name='qnotice_title' value={writeForm.qnotice_title} onChange={changeWriteForm}/>    
                  </div>
                  <div className='qnotice_content'>
                    <span>내용</span>
                    <textarea name='qnotice_content' value={writeForm.qnotice_content} onChange={changeWriteForm}></textarea> 
                  </div>
                  <input type="hidden" value={writeForm.userid}/>
                  <div className="formbtns">
                    <button type="submit">등록하기</button>
                  </div>    
                </div>
              </form>
            ) : (
              <div className="noslide no-hover" style={{ height: "300px", marginTop: '20px' }}>
                <BsExclamationCircle />
                <p>{modalTitle}이 없습니다.</p>
              </div>
            )}
          </Modal>
        )}
        <h3>공지 관리</h3>
        <hr />
        <div className="member-filterArea">
            <div className="adminSearchForm">
                <form 
                // onSubmit={submitData}>
                >
                    <select
                        className="MemSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}
                        >
                        <option value="qnotice_title">공지 제목</option>
                        <option value="qnotice_content">공지 내용</option>
                        <option value="write_date">작성일</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        // onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
            </div>    
        </div>
        <button onClick={() => setIsModalOpen(true)}>공지 등록</button>
        <form className="adminQnaEdit"
        // onSubmit={editActiveStateSubmit}
        >
            <div className='active_box'>
                <select
                // value={editActive_state}
                // onChange={handleActive_StateChange}
                    >
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                </select>
                <button type="submit">저장</button>
            </div>
          <table className="table table-dark table-hover AdminMovieTable">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>공지번호</th>
                <th>공지제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>상태</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {qNotice && qNotice.length > 0 ? (
                       qNotice.map((item, index)=>(
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{item.qnotice_no}</td>
                      <td>{item.qnotice_title}</td>
                      <td>{item.userid}</td>
                      <td>{item.write_date}</td>
                      <td>{item.active_state}</td>
                      <td><button>공지 수정</button></td>
                    </tr>))
                       ):(
                       <tr>
                        <td colSpan="7">현재 데이터 없음</td>
                      </tr>)}
            </tbody>
          </table>
        </form>
      </div>
    )

}

export default Notice;