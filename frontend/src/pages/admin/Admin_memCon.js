import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";
import { debounce } from 'lodash';

import './../../css/admin/adminMemCon.css'

function MemCon(){
    const [member, setMember]=useState([]);
    const [searchKey, setSearchKey]=useState('userid');
    const [searchWord, setSearchWord]=useState('');
    const [checkedMems, setCheckedMems] = useState(new Array(member.length).fill(false));
    const [editActive_state, setEditActive_state]=useState('1');

    //멤버리스트 불러오기
    useEffect(()=>{
        axios.get(`http://localhost:9988/admin/MemList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
        .then(response => {
            // console.log(response.data);
            setMember(response.data.memList);

        })
        .catch(error => {
            console.error("데이터 로드 중 오류 발생:", error);
        });
    },[searchKey,searchWord]);

    //입력시 대기
    const debounce = (func, delay) => {
        let debounceTimer;
        return function (...args) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
      };

    const genderChk=(e)=>{
        e.preventDefault();
        const searchValue=e.target.value;
        setSearchKey('gender');
        setSearchWord(searchValue);   
    }
    const handlesearchKeyChange = (e) => { //검색키 처리
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        setSearchWord(e.target.value);
    };
        //active옵션 관리
    const handleActive_StateChange=(e)=>{
        setEditActive_state(e.target.value);
    }

    const handleSearchSubmit = debounce((e) => {
        e.preventDefault();

        axios.get(`http://localhost:9988/admin/MemList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                // console.log(response.data);
                setMember(response.data.memList);
                // console.log("검색키:"+searchKey+",검색어:"+searchWord);
            })
            .catch(error => {
                console.error("검색 중 오류 발생:", error);
            });
    },500);

    //체크 전체 관리
    const [isAllMemChecked, setAllMemChecked] = useState(false);
    //전체 체크 박스 클릭 시
    const handleAllMemChecked = () => {
        const newCheckedState = !isAllMemChecked;
        setAllMemChecked(newCheckedState);
        setCheckedMems(new Array(member.length).fill(newCheckedState));  
      };
    // 모든 항목의 체크 상태를 동일하게 변경
    const handleMemChecked = (index) => {
        const newCheckedMems = [...checkedMems];
        newCheckedMems[index] = !newCheckedMems[index]; // 해당 항목의 체크 상태 변경
        setCheckedMems(newCheckedMems);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllMemChecked(newCheckedMems.every(item => item === true));
    };

    //useEffect를 사용하여 QnA 데이터가 변경될 때 체크 상태 초기화
    useEffect(() => {
        setCheckedMems(new Array(member.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
        setAllMemChecked(false); // 전체 체크박스 상태 초기화
    }, [member]);

    const editActiveStateSubmit = (e) => {
        e.preventDefault();

        const formData =new FormData();

        checkedMems.forEach((isChecked, index) => {
            if (isChecked) {
                const userid = member[index]?.userid; // 체크된 항목의 qna_no를 가져옵니다.
                ; 
                if (userid) {
                    formData.append('userid', userid); // qna_no를 폼 데이터에 추가합니다.           
                }
            }
        });
        formData.append('active_state',editActive_state);

        formData.forEach((value, key) => {
            console.log("키:",key,"값:",value);
        });

        console.log(formData);
        axios.post('http://localhost:9988/admin/memActiveEdit', formData)
            .then(response => {
                console.log('성공:', response.data);
            })
            .catch(error => {
                console.error('오류 발생:', error);
            });

      }


    return(
<div className="AdminMemBody">
    <h3>멤버 관리</h3>
    <hr />
    <div>
        멤버 필터 폼
        <div className="member-filterArea">
            <button value='1' onClick={genderChk}>남</button>
            <button value='2' onClick={genderChk}>여</button>

            <div className="adminSearchForm">
                <form onSubmit={handleSearchSubmit}>
                    <select
                        className="MemSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}>
                        <option value="userid">유저아이디</option>
                        <option value="username">유저이름</option>
                        <option value="usernick">유저 닉네임</option>
                        <option value="usertel">연락처</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
            </div>    
        </div>
        <form className="adminQnaEdit" onSubmit={editActiveStateSubmit}>
            <div>              
                <select
                    value={editActive_state}
                    onChange={handleActive_StateChange}>
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                </select>
                <button type="submit">저장</button>
            </div>
            <table className="table table-dark table-hover AdminMemTable">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox"
                                checked={isAllMemChecked}
                                onChange={handleAllMemChecked} />
                        </th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>닉네임</th>
                        <th>성별</th>
                        <th>전화번호</th>
                        <th>상태</th>
                        <th>가입일</th>
                        <th>신고 횟수</th>
                        <th>마지막 로그인</th>
                    </tr>
                </thead>
                <tbody>
                    {member && member.length > 0 ? (
                        member.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input type="checkbox"
                                        checked={checkedMems[index]}
                                        value={item?.userid || ''}
                                        onChange={() => handleMemChecked(index)} />
                                </td>
                                <td>{item.userid}</td>
                                <td>{item.username}</td>
                                <td>{item.usernick}</td>
                                <td>{item.gender == 1 ? "남" : "여"}</td>
                                <td>{item.usertel ? item.usertel : "-"}</td>
                                <td className={item.active_state === 1 ? "status-active" : "status-inactive"}>
                                    {item.active_state === 1 ? "활성" : "비활성"}
                                </td>
                                <td>{item.regiserdate}</td>
                                <td>{item.reported_count}</td>
                                <td>{item.last_login}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="no-results">
                            <td colSpan="10">검색한 내용을 포함한 멤버가 존재하지 않습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </form>
    </div>
</div>

    )
}
export default MemCon