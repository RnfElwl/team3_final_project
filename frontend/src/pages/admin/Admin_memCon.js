import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminMemCon.css'

function MemCon(){
    const [member, setMember]=useState([]);
    const [searchKey, setSearchKey]=useState('userid');
    const [searchWord, setSearchWord]=useState('');



    useEffect(()=>{
        axios.get(`http://localhost:9988/admin/MemList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
        .then(response => {
            console.log(response.data);
            setMember(response.data.memList);
            // setTotalRecord(response.data.qnaTotalPages);

        })
        .catch(error => {
            console.error("데이터 로드 중 오류 발생:", error);
        });
    },[searchKey,searchWord]);

    const activeChk=(e)=>{
        e.preventDefault();
        const searchValue=e.target.value;
        setSearchKey('u.gender');
        setSearchWord(searchValue);   
    }




    return(
        <div className="AdminMemBody">
            <h3>멤버 관리</h3>
            <hr/>
            <div>
                멤버 필터 폼
                <button
                value='1'
                onClick={activeChk}>활동 중</button>
            </div>
            <table className="table table-dark table-hover AdminMemTable">
                <thead>
                    <tr>
                        <th rowSpan="2">
                            <input type="checkbox"/>
                        </th>
                        <th rowSpan="2">userid</th>
                        <th>이름</th>
                        <th rowSpan="2">성별</th>
                        <th rowSpan="2">전화번호</th>
                        <th>상태</th>
                        <th>가입일</th>
                    </tr>
                    <tr>
                        <th rowSpan="2">닉네임</th>
                        <th>신고당한 횟수</th>
                        <th>마지막 로그인</th>
                    </tr>
                </thead>
                
        {member && member.length > 0 ? (
                member.map((item, index) => (
                    <tbody key={index}>
                    <tr>
                        <td rowSpan="2">
                            <input type="checkbox"/>
                        </td>
                        <td rowSpan="2">{item.userid}</td>
                        <td>{item.username}</td>
                        <td rowSpan="2">{item.gender==1? "남":"여"}</td>
                        <td rowSpan="2">{item.usertel? item.usertel:"전화번호 없음."}</td>
                        <td className={item.active_state === 1 ? "status-active" : "status-inactive"}>
                            {item.active_state==1? "활성":"비활성"}</td>
                        <td>{item.regiserdate}</td>
                    </tr>
                    <tr key={index}>
                        <td rowSpan="2">{item.usernick}</td>
                        <td>신고당한 횟수</td>
                        <td>마지막 로그인</td>
                    </tr>
                    </tbody>))):(
                    <tbody>
                        <tr colSpan="7" className="no-results">
                            <td>검색한 내용을 포함한 멤버가 존재하지 않습니다.</td>
                        </tr>
                    </tbody>
                    )}
                
            </table>

        </div>
    )
}
export default MemCon