import './../../css/admin/adminBanMemCon.css'

import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";


function BanMem(){
    const [banMemList, setBanMemList]=useState([]);
    const [searchKey, setSearchKey]=useState('userid');
    const [searchWord, setSearchWord]=useState('');
    const [checkedBanIds, setCheckedBanIds] = useState(new Array(banMemList.length).fill(false));
    const [editActive_state, setEditActive_state] = useState('1');

    const handleActive_StateChange = (e) => {
        setEditActive_state(e.target.value);
    }
    
    useEffect(()=>{
        axios.get(`http://localhost:9988/admin/banMemList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
        .then(response => {
            console.log(response.data);
            setBanMemList(response.data.banMemList);

        })
        .catch(error => {
            console.error("데이터 로드 중 오류 발생:", error);
        });
    },[searchKey,searchWord]);


        //삭제 체크  전체 관리
        const [isAllBanIdChecked, setAllBanIdChecked] = useState(false);
        //전체 체크 박스 클릭 시
        const handleAllBanIdChecked = () => {
            const newCheckedState = !isAllBanIdChecked;
            setAllBanIdChecked(newCheckedState);
            setCheckedBanIds(new Array(banMemList.length).fill(newCheckedState)); // 모든 항목의 체크 상태를 동일하게 변경
        };
    
        const handleBanIdChecked = (index) => {
            const newCheckedBanIds = [...checkedBanIds];
            newCheckedBanIds[index] = !newCheckedBanIds[index]; // 해당 항목의 체크 상태 변경
            setCheckedBanIds(newCheckedBanIds);
    
            // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
            setAllBanIdChecked(newCheckedBanIds.every(item => item === true));
        };
    
        //useEffect를 사용하여 QnA 데이터가 변경될 때 체크 상태 초기화
        useEffect(() => {
            setCheckedBanIds(new Array(banMemList.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
            setAllBanIdChecked(false); // 전체 체크박스 상태 초기화
        }, [banMemList]);

        const editActiveStateSubmit=(e)=>{
            e.preventDefault();

            const formData=new FormData();

            const selectedBanIds=[];

            checkedBanIds.forEach((isChecked,index)=>{
                if(isChecked){
                    const userid=banMemList[index]?.userid;
                    if(userid){
                        FormData.append('userid',userid);
                        selectedBanIds.push(userid);
                    }
                }
            })
        }
    return(
        <div className="bannedMemBody">
                <h3>정지 멤버 관리</h3>
        <hr />
        <div>
            정지 멤버 필터 폼
            <div className="member-filterArea">
                {/* <button value='1' onClick={genderChk}>남</button>
                <button value='2' onClick={genderChk}>여</button> */}

                <div className="adminSearchForm">
                    <form
                        // onSubmit={handleSearchSubmit}
                    >
                        {/* <select
                            className="MemSearchSelect"
                            name="searchKey"
                            value={searchKey}
                            onChange={handlesearchKeyChange}>
                            <option value="userid">유저아이디</option>
                            <option value="username">유저이름</option>
                            <option value="usernick">유저 닉네임</option>
                            <option value="usertel">연락처</option>
                        </select> */}
                        <input
                            type="text"
                            name="searchWord"
                            className="qnaSearchWord"
                            // onChange={handlesearchWordChange}
                            placeholder="Search..." />
                    </form>
                </div>    
            </div>
            <form
                className="adminMemEdit"
                onSubmit={editActiveStateSubmit}
                >
                <div>              
                    <select
                        value={editActive_state}
                        onChange={handleActive_StateChange}
                        >
                        <option disabled>선택하세요</option>
                        <option value="2">정지</option>
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
                                    checked={isAllBanIdChecked}
                                    onChange={handleAllBanIdChecked}
                                    />
                            </th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>닉네임</th>
                            <th>정지 시작</th>
                            <th>정지 종료</th>
                            <th>상태</th>
                            <th>가입일</th>
                            <th>신고 누적</th>
                            <th>신고 기간 수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banMemList && banMemList.length > 0 ? (
                            banMemList.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type="checkbox"
                                            checked={checkedBanIds[index]}
                                            value={item?.userid || ''}
                                            onChange={() => handleBanIdChecked(index)}
                                            />
                                    </td>
                                    <td>{item.userid}</td>
                                    <td>{item.username}</td>
                                    <td>{item.usernick}</td>
                                    <td>{item.start_banDate}</td>
                                    <td>{item.stop_banDate}</td>
                                    <td className={item.active_state === 1 ? "status-active" : "status-inactive"}>
                                        {item.active_state === 1 ? "활성" :
                                        item.active_state===2? "정지":"비활성"}
                                    </td>
                                    <td>{item.regiserdate}</td>
                                    <td>{item.reported_count}</td>
                                    <td></td>
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

export default BanMem;