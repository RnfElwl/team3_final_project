import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminComCon.css';

function ComCon(){
    const [CommunityActivity, setCommunityActivity]=useState(1);
    const [community, setCommunity]=useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchKey, setSearchKey]=useState('1');
    const [searchWord, setSearchWord]=useState('1');
    const [filter, setFilter]=useState('');
    const [activeStateChk, setActiveStateChk]=useState('');
    const [stateChk, setstateChk]=useState('');
    const navigate = useNavigate();
    //전체페이지
    const totalPage = Math.ceil(totalRecord / 12);
    //페이지네이션
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };

    const comUrl = `http://localhost:9988/admin/comList?nowPage=${nowPage}`+ 
    `&searchKey=${searchKey||''}` + 
    `&searchWord=${encodeURIComponent(searchWord) ||''}`+
    `&activeStateChk=${activeStateChk ||''}`+
    `&stateChk=${stateChk||''}`
    // `&orderColumn=${orderColumn}` + 
    // `&orderType=${orderType}`;


    //커뮤니티 탭
    const handleComTap=(e) => {
        e.preventDefault();
        setCommunityActivity(e.target.value);
    };

    useEffect(() => {
        // `http://localhost:9988/admin/comList?nowPage=${nowPage}&searchKey=${searchKey || ''}&searchWord=${encodeURIComponent(searchWord || '')}`
        axios.get(comUrl)
            .then(response => {
                console.log(response.data);
                setCommunity(response.data.comList);
                setTotalRecord(response.data.comTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
    }, [nowPage, searchKey, searchWord]);

    return(
        <div className="AdminComBody">
            <h3>Community 관리</h3>
            <hr/>
            <div className="AdCom-tapMenu">
                <button
                    className="comListTap"
                    onClick={handleComTap}
                    value="1"
                    disabled={CommunityActivity==1}>글</button>
                <button
                    className="comListTap"
                    onClick={handleComTap}
                    value="0"
                    disabled={CommunityActivity==0}>댓글</button>
            </div>
            {CommunityActivity&&CommunityActivity==1 ?
            ( <table className="AdminComTable">
                <thead>
                    <tr>
                        <th>
                            <input
                            type="checkbox"
                            // checked={isAllComChecked}
                            // onChange={handleAllComChecked}
                            />
                        </th>
                        <th>No.</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>상태</th>
                        <th>좋아요 수</th>
                    </tr>
                </thead>
                <tbody>
                {community && community.length > 0 ? (
                    community.map((item, index) => (
                        <tr key={index}>
                            <td>
                            <input
                                type="checkbox"
                                // checked={checkedComs[index]}
                                // value={item.community_no || ''}
                                // onChange={() => handleComChecked(index)}
                                />
                            </td>
                            <td>{item.community_no}</td>
                            <td>{item.userid}</td>
                            <td>
                                    {item.category==0?
                                        <span className="adminCategory">[Movie]</span>:
                                      item.category==1?
                                        <span className="adminCategory">[Daily]</span>:
                                      item.category==2?
                                      <span className="adminCategory">[Free]</span>:
                                      <span></span>}
                            <span className="qna_tableTitle"  
                                    onClick={(e)=>navigate(`/community/communityView/${item.community_no}`)}>
                                        {item.community_title}
                                    </span>  
                            </td>
                            <td>{item.community_writedate}</td>
                            <td>{item.hit}</td>
                            <td>{item.active_state==1? "활성":"비활성"}</td>
                            <td>{item.community_like}</td>
                        </tr>)))
                        :(<tr colspan="8">검색한 내용을 포함한 신고내역이 존재하지 않습니다.</tr>)}
                    </tbody>
    
                </table>):
                (<table className="AdminComMenTable">
                    <thead>
                        <tr>
                            <th>
                                <input
                                type="checkbox"
                                // checked={isAllComChecked}
                                // onChange={handleAllComChecked}
                                />
                            </th>
                            <th>No.</th>
                            <th>작성자</th>
                            <th>내용</th>
                            <th>작성일</th>
                            <th>조회수</th>
                            <th>상태</th>
                            <th>좋아요 수</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* {community && community.length > 0 ? (
                        community.map((item, index) => (
                            <tr key={index}>
                                <th>
                                <input
                                    type="checkbox"
                                    // checked={checkedComs[index]}
                                    // value={item.community_no || ''}
                                    // onChange={() => handleComChecked(index)}
                                    />
                                </th>
                                <th>{item.community_no}</th>
                                <th>{item.userid}</th>
                                <th>
                                        {item.category==0?
                                            <span className="adminCategory">[Movie]</span>:
                                          item.category==1?
                                            <span className="adminCategory">[Daily]</span>:
                                          item.category==2?
                                          <span className="adminCategory">[Free]</span>:
                                          <span></span>}
                                <span className="qna_tableTitle"  
                                        onClick={(e)=>navigate(`/community/communityView/${item.community_no}`)}>
                                            {item.community_title}
                                        </span>  
                                </th>
                                <th>{item.community_writedate}</th>
                                <th>{item.hit}</th>
                                <th>{item.active_state==1? "활성":"비활성"}</th>
                                <th>{item.community_like}</th>
                            </tr>)))
                            :(<tr>검색한 내용을 포함한 신고내역이 존재하지 않습니다.</tr>)} */}
                        </tbody>
        
                    </table>)}
        </div>
    );
}

export default ComCon;