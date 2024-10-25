import './../../css/admin/adminNoticeCon.css'

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import Modal from '../../component/api/Modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BsExclamationCircle } from "react-icons/bs";

function Notice() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("공지 등록 폼");
    const [qnotice_title,setQnotice_title]=useState('');
    const [qnotice_content, setQnotice_content]=useState('');
    const [writeForm, setWriteForm] = useState({});

    async function writeBtnClick(no) {
        try {
            await axios.get(`http://localhost:9988/api/qnaNotices/`);
        } catch (e) {
            console.log(e);
        }
        setIsModalOpen(true);
    }

    function changeWriteForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setWriteForm((p)=>{return {...p, [idField]:idValue}});
        console.log(writeForm);
    }

    return (
        <div className="noticeBody">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} title={modalTitle} className="insert_form">
            {true ? ( 
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <div className='edit_input'>
                  <div className='noticeTitle'>
                    <span>제목</span> 
                    <input type='text' name='qnotice_title' value={writeForm.qnotice_title} onChange={changeWriteForm}/>    
                  </div>
                  <div className='qnotice_content'>
                    <span>내용</span>
                    <CKEditor
                      editor={ClassicEditor}
                      data={qnotice_content}
                      className="qnaNoticeContent"
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setQnotice_content(data);
                      }}
                    />
                  </div>
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
        <button onClick={() => setIsModalOpen(true)}>등록</button>
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
            <tr>
              <td>
                <input type="checkbox" />
              </td>
              <td>1</td>
              <td>qna페이지 점검</td>
              <td>admin1</td>
              <td>2024-10-25</td>
              <td>활성</td>
              <td><button>수정</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    )

}

export default Notice;