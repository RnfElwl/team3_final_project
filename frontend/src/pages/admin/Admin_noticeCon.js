import './../../css/admin/adminNoticeCon.css'


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsExclamationCircle } from "react-icons/bs";
import axios from '../../component/api/axiosApi';
import Modal from '../../component/api/Modal';

function Notice() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("공지 등록 폼");
    const [searchKey, setSearchKey] =useState('notice_title');
    const [searchWord, setSearchWord]=useState('');
    const [writeForm, setWriteForm] = useState({});
    const [editForm, setEditForm] = useState({});
    const [notice, setNotice]=useState([]);
    const [checkedNotices, setCheckedNotices] = useState(new Array(notice.length).fill(false));
    const [editActive_state, setEditActive_state]=useState('1');
    const [isAllNoticeChecked, setAllNoticeChecked] = useState(false);

      useEffect(() => {
        setCheckedNotices(new Array(notice.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
        setAllNoticeChecked(false); // 전체 체크박스 상태 초기화
    }, [notice]);
    const handleActive_StateChange=(e)=>{
      setEditActive_state(e.target.value);
    }
    const handleAllNoticeChecked = () => {
      const newCheckedState = !isAllNoticeChecked;
      setAllNoticeChecked(newCheckedState);
      setCheckedNotices(new Array(notice.length).fill(newCheckedState));  
    };
    // 모든 항목의 체크 상태를 동일하게 변경
    const handleNoticeChecked = (index) => {
        const newCheckedNotices = [...checkedNotices];
        newCheckedNotices[index] = !newCheckedNotices[index]; // 해당 항목의 체크 상태 변경
        setCheckedNotices(newCheckedNotices);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllNoticeChecked(newCheckedNotices.every(item => item === true));
    };

    const editActiveStateSubmit = (e) => {
      e.preventDefault();

      const formData =new FormData();

      const selectedNotices = [];

      checkedNotices.forEach((isChecked, index) => {
          if (isChecked) {
              const notice_no = notice[index]?.notice_no; 
              ; 
              if (notice_no) {
                  formData.append('notice_no', notice_no);  
                  selectedNotices.push(notice_no);          
              }
          }
      });
      formData.append('active_state',editActive_state);

      formData.forEach((value, key) => {
          console.log("키:",key,"값:",value);
      });

      console.log(formData);
      axios.post('http://localhost:9988/admin/noticeActiveEdit', formData)
          .then(response => {
              console.log('성공:', response.data);
              if (response.data === selectedNotices.length) {
                getNoticeList();
              }
          })
          .catch(error => {
              console.error('오류 발생:', error);
          });
    }


    //useEffect를 사용하여 QnA 데이터가 변경될 때 체크 상태 초기화


    const handlesearchKeyChange = (e) => { //검색키 처리
      console.log(e.target.value)
      setSearchKey(e.target.value);
  };
    const handlesearchWordChange = (e) => { //검색키 처리
      console.log(e.target.value)
      setSearchWord(e.target.value);
  };

    async function editBtnClick(no) {
      try {
        const response = await axios.get(`http://localhost:9988/admin/notice/${no}`);
        
        if (response.data) {
            setEditForm(response.data[0]); // 데이터를 editForm에 세팅
            setIsEditModalOpen(true);
        }
      } catch (e) {
          console.log(e);
      }
    }

    //등록폼 핸들러
    function changeWriteForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setWriteForm((p)=>{return {...p, [idField]:idValue}});
        console.log(writeForm);
    }
    //수정폼 핸들러
    function changeEditForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setEditForm((p)=>{return {...p, [idField]:idValue}});
        console.log(editForm);
    }

    //등록폼
    async function notice_WriteForm(e){
      e.preventDefault();
      console.log(writeForm)
      try{
          const {data} = await axios.post("http://localhost:9988/admin/notice/write", writeForm ,{
              headers: {
                'Content-Type': 'application/json'
              }
            });
          if(data===1){
              setIsModalOpen(false);
              getNoticeList();
          }
      }catch(e){
          console.log(e);
      }

    }
    //수정폼
    async function notice_editForm(e){
      e.preventDefault();
      console.log(editForm)
      try{
          const {data} = await axios.post("http://localhost:9988/admin/notice/edit", editForm ,{
              headers: {
                'Content-Type': 'application/json'
              }
            });
          if(data===1){
              setIsEditModalOpen(false);
              getNoticeList();
          }
      }catch(e){
          console.log(e);
      }

    }

    //목록 호출
    async function getNoticeList(){
      try{
          const {data} = await axios.get(`http://localhost:9988/admin/noticeList`, {params:{
              searchKey,
              searchWord
          }});
          setNotice(data);
      }catch(e){
          console.log(e);
      }
  }
  useEffect(()=>{
      getNoticeList();
  }, []);


  function submitData(e){
    e.preventDefault();
    getNoticeList();
  }


    return (
        <div className="noticeBody">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} title={modalTitle} className="insert_form">
            {true ? ( 
              <form onSubmit={notice_WriteForm}>
                <div className='edit_input'>
                  <div className='noticeTitle'>
                    <span>제목</span> 
                    <input type='text' name='notice_title' value={writeForm.notice_title} onChange={changeWriteForm}/>    
                  </div>
                  <div className='notice_content'>
                    <span>내용</span>
                    <textarea name='notice_content' value={writeForm.notice_content} onChange={changeWriteForm}></textarea> 
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
        {isEditModalOpen && (
          <Modal onClose={() => setIsEditModalOpen(false)} title={"공지 수정폼"} className="edit_form">
            {true ? ( 
              <form onSubmit={notice_editForm}>
                <div className='edit_input'>
                  <div className='noticeTitle'>
                    <span>제목</span> 
                    <input type='text' name='notice_title' value={editForm.notice_title} onChange={changeEditForm}/>    
                  </div>
                  <div className='notice_content'>
                    <span>내용</span>
                    <textarea name='notice_content' value={editForm.notice_content} onChange={changeEditForm}></textarea> 
                  </div>
                  <input type="hidden" value={editForm.userid}/>
                  <div className="formbtns">
                    <button type="submit">등록하기</button>
                  </div>    
                </div>
              </form>
            ) : (
              <div className="noslide no-hover" style={{ height: "300px", marginTop: '20px' }}>
                <BsExclamationCircle />
                <p>{"공지 수정폼"}이 없습니다.</p>
              </div>
            )}
          </Modal>
        )}
        <h3>공지 관리</h3>
        <hr />
        <div className="member-filterArea">
            <div className="adminSearchForm">
                <form onSubmit={submitData}>
                    <select
                        className="MemSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}
                        >
                        <option value="notice_title">공지 제목</option>
                        <option value="notice_content">공지 내용</option>
                        <option value="write_date">작성일</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
                <button onClick={() => setIsModalOpen(true)}>공지 등록</button>
            </div>    
        </div>
        <form className="adminQnaEdit"
        onSubmit={editActiveStateSubmit}>
            <div className='active_box'>
                <select
                value={editActive_state}
                onChange={handleActive_StateChange}>
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                </select>
                <button type="submit">저장</button>
            </div>
          <table className="table table-dark table-hover AdminMovieTable">
            <thead>
              <tr>
                <th>
                <input 
                    type="checkbox" 
                    checked={isAllNoticeChecked}
                    onChange={handleAllNoticeChecked} 
                  />
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
              {notice && notice.length > 0 ? (
                       notice.map((item, index)=>(
                    <tr>
                      <td>
                        <input type="checkbox"
                        checked={checkedNotices[index]}
                        value={item?.notice_no || ''}
                        onChange={() => handleNoticeChecked(index)}/>
                      </td>
                      <td>{item.notice_no}</td>
                      <td>{item.notice_title}</td>
                      <td>{item.userid}</td>
                      <td>{item.write_date}</td>
                      <td>{item.active_state==1 ? "활성":
                           item.active_state==2 ? "수정됨":"비활성"}</td>
                      <td><button type="button" onClick={()=>editBtnClick(item?.notice_no)}>공지 수정</button></td>
                    </tr>))
                       ):(
                       <tr>
                        <td colSpan="7">검색한 내용을 포함한 공지가 존재하지 않습니다.</td>
                      </tr>)}
            </tbody>
          </table>
        </form>
      </div>
    )

}

export default Notice;