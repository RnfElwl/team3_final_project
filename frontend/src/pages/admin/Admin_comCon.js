import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminComCon.css';

function ComCon(){
    const [CommunityActivity, setCommunityActivity] = useState(1);
    const [community, setCommunity] = useState([]);
    const [com_com, setCom_com] = useState([]);
    const [reply, setReply]=useState([])
    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [totalComMenRecord, setTotalComMenRecord ] = useState(0);
    const [totalComReplyRecord, setTotalReplyRecord]=useState(0);
    const [searchKey, setSearchKey] = useState({
        community: 'community_title',
        comments: 'comment_content',
        replies: 'reply_content',
    });
    const [keyWord, setKeyWord] = useState("");
    const [searchWord, setSearchWord] = useState('');
    const [filter, setFilter] = useState('');
    const [activeStateChk, setActiveStateChk] = useState(1);
    const [stateChk, setstateChk] = useState('');
    const navigate = useNavigate();
    const [editActive_state, setEditActive_state] = useState('1');


    const [checkedCommunities, setCheckedCommunities] = useState([]);//커뮤니티 글 체크박스
    const [checkedComments, setCheckedComments] = useState([]);//커뮤니티 댓글 체크박스
    const [checkedReplies, setCheckedReplies]=useState([]);//커뮤니티 대댓글 체크박스
    const [isAllComChecked, setAllComChecked] = useState(false);

    //페이지네이션
    const totalPage = Math.ceil(totalRecord / 12);
    const totalComMenPage = Math.ceil(totalComMenRecord / 12);
    const totalReplyPage=Math.ceil(totalComMenRecord / 12);

    const handleActive_StateChange = (e) => {
        setEditActive_state(e.target.value);
    }
    const handleSearchKeyChange = (e) => {
        console.log(e.target.value);
        setKeyWord(e.target.value);
        let temp = searchKey;
        temp[CommunityActivity === 1 ? 'community' : CommunityActivity === 2 ? 'comments' : 'replies'] = e.target.value;
        console.log(temp);
        setSearchKey(temp);
    
        };
    const handlesearchWordChange = (e) => {
        setSearchWord(e.target.value);
    };

    //데이터 요청
    useEffect(() => {
        const comUrl = `http://localhost:9988/admin/comList?nowPage=${nowPage}` + 
        `&searchKey=${searchKey[CommunityActivity === 1 ? 'community' : CommunityActivity === 2 ? 'comments' : 'replies']}` + 
        `&searchWord=${encodeURIComponent(searchWord) || ''}` + 
        `&activeStateChk=${activeStateChk || ''}` + 
        `&stateChk=${stateChk || ''}` +
        `&tabActive=${CommunityActivity || ''}`;

        const comunityData = async () => 
            axios.get(comUrl)
            .then(response => {
                console.log(response.data);
                setCommunity(response.data.comList);
                setTotalRecord(response.data.comTotalPages);
                setCom_com(response.data.comMenList);
                setTotalComMenRecord(response.data.comMenTotalPages);
                setReply(response.data.replyList);
                setTotalReplyRecord(response.data.comRepTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
            comunityData()
    }, [nowPage]);

    useEffect(()=>{
        setSearchWord("");
        resetMenu("");
        
        setKeyWord([CommunityActivity === 1 ? 'community_title' : CommunityActivity === 2 ? 'comment_content' : 'reply_content'])
    }, [CommunityActivity])
    //서치폼 서브밋
    function resetMenu(word){
        const comUrl = `http://localhost:9988/admin/comList?nowPage=${nowPage}` + 
        `&searchKey=${searchKey[CommunityActivity === 1 ? 'community' : CommunityActivity === 2 ? 'comments' : 'replies']}` + 
        `&searchWord=${encodeURIComponent(word) || ''}` + 
        `&activeStateChk=${activeStateChk || ''}` + 
        `&stateChk=${stateChk || ''}`+
        `&tabActive=${CommunityActivity || ''}`;
        
        console.log(searchKey);
        console.log(searchKey[CommunityActivity === 1 ? 'community' : CommunityActivity === 2 ? 'comments' : 'replies']);
        console.log("검색키:" + searchKey + ",검색어:" + searchWord);
        setNowPage(1);
        axios.get(comUrl)
            .then(response => {
                console.log(response.data);
                setCommunity(response.data.comList);
                setCom_com(response.data.comMenList);
                setReply(response.data.replyList);
                setTotalRecord(response.data.comTotalPages);
                console.log("검색키:" + searchKey + ",검색어:" + searchWord);
            })
            .catch(error => {
                console.error("검색 중 오류 발생:", error);
            });
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        resetMenu(searchWord);
    };

    // 탭 스위칭 핸들
    const handleComTap = (e) => {
        e.preventDefault();
        const selectedTab = Number(e.target.value);
        setCommunityActivity(selectedTab);
        setCheckedCommunities([]); //탭 바뀔때마다 체크값이 변경
        setCheckedComments([]);
        setCheckedReplies([]);
        
    };

    // 커뮤니티 탭별 체크박스 핸들
    const handleAllComChecked = () => {
        if (CommunityActivity === 1) {
            const newCheckedState = !isAllComChecked;
            setAllComChecked(newCheckedState);
            setCheckedCommunities(new Array(community.length).fill(newCheckedState));
        } else if (CommunityActivity === 2) {
            const newCheckedState = !isAllComChecked;
            setAllComChecked(newCheckedState);
            setCheckedComments(new Array(com_com.length).fill(newCheckedState));
        }
        else if(CommunityActivity ===3){
            const newCheckedState = !isAllComChecked;
            setAllComChecked(newCheckedState);
            setCheckedReplies(new Array(reply.length).fill(newCheckedState));
        }
    };

    // 체크박스 핸들
    const handleComChecked = (index) => {
        if (CommunityActivity === 1) {
            const newCheckedCommunities = [...checkedCommunities];
            newCheckedCommunities[index] = !newCheckedCommunities[index];
            setCheckedCommunities(newCheckedCommunities);
            setAllComChecked(newCheckedCommunities.every(Boolean));
        } else if (CommunityActivity === 2) {
            const newCheckedComments = [...checkedComments];
            newCheckedComments[index] = !newCheckedComments[index];
            setCheckedComments(newCheckedComments);
            setAllComChecked(newCheckedComments.every(Boolean));
        }
        else if(CommunityActivity === 3){
            const newCheckedReplies = [...checkedReplies];
            newCheckedReplies[index] = !newCheckedReplies[index];
            setCheckedReplies(newCheckedReplies);
            setAllComChecked(newCheckedReplies.every(Boolean));
        }
    };

    //active폼 서브밋
    const editActiveStateComSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // 선택된 커뮤니티 글들
        checkedCommunities.forEach((isChecked, index) => {
            if (isChecked) {
                formData.append('community_no', community[index]?.community_no);
            }
        });

        // 선택된 댓글들
        checkedComments.forEach((isChecked, index) => {
            if (isChecked) {
                formData.append('comment_no', com_com[index]?.comment_no);
            }
        });

        // 선택된 대댓글들
        checkedReplies.forEach((isChecked, index) => {
            if (isChecked) {
                formData.append('reply_no', reply[index]?.reply_no);
            }
        });

        formData.append('active_state', editActive_state);

        // 폼데이터 확인
        formData.forEach((value, key) => {
            console.log("Key:", key, "Value:", value);
        });

        axios.post('http://localhost:9988/admin/comList?nowPage=${nowPage}',formData)
        .then(response=>{
            console.log('성공:',response.data);
            // handleSearchSubmit(e);
        }).catch(error=>{
            console.error('오류발생:',error)
        })
    };
 

    return (
        <div className="AdminComBody">
            <h3>Community 관리</h3>
            <hr />
            <form className="comSearchForm"
            onSubmit={handleSearchSubmit}
            >
                <div>
                    <div className="adminSearchForm">
                        <div>
                        {CommunityActivity === 1 ?(
                            <select
                                className="qnaSearchSelect"
                                name="searchKey"
                                value={keyWord}
                                onChange={handleSearchKeyChange}>
                                <option value="community_title">제목</option>
                                <option value="community_content">내용</option>
                                <option value="userid">작성자</option>
                                <option value="community_no">번호</option>
                            </select>):
                            CommunityActivity === 2 ?(<select
                                className="qnaSearchSelect"
                                value={keyWord}
                                name="searchKey"
                                onChange={handleSearchKeyChange}>
                                <option value="comment_content">글내용</option>
                                <option value="userid">작성자</option>
                                <option value="comment_no">번호</option>
                            </select>):CommunityActivity === 3 ?(<select
                                className="qnaSearchSelect"
                                value={keyWord}
                                name="searchKey"
                                onChange={handleSearchKeyChange}>
                                <option value="reply_content">내용</option>
                                <option value="userid">작성자</option>
                                <option value="reply_no">번호</option>
                            </select>):<></>}
                            <input
                                type="text"
                                name="searchWord"
                                className="qnaSearchWord"
                                value={searchWord}
                                onChange={handlesearchWordChange}
                                placeholder="Search..." />
                        </div>
                    </div>
                </div>
            </form>
            <form onSubmit={editActiveStateComSubmit}>
                <div className="AdCom-tapMenu">
                    <button
                        className="comListTap"
                        onClick={handleComTap}
                        value="1"
                        disabled={CommunityActivity === 1}>글</button>
                    <button
                        className="comListTap"
                        onClick={handleComTap}
                        value="2"
                        disabled={CommunityActivity === 2}>댓글</button>
                    <button
                        className="comListTap"
                        onClick={handleComTap}
                        value="3"
                        disabled={CommunityActivity === 3}>대댓글</button>
                </div>
                <select
                        value={editActive_state}
                        onChange={handleActive_StateChange}
                        className="qna_active_editopt"
                    >
                        <option value={1}>활성</option>
                        <option value={0}>비활성</option>
                </select>

                <button type="submit">전송</button>

                {CommunityActivity === 1 ? (
                    <table className="AdminComTable">
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={isAllComChecked}
                                    onChange={handleAllComChecked} /></th>
                                <th>No.</th>
                                <th>작성자</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>조회수</th>
                                <th>상태</th>
                                <th>수정일</th>
                                <th>수정인</th>
                                <th>좋아요 수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {community && community.length > 0 ? community.map((item, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" checked={checkedCommunities[index]}
                                        onChange={() => handleComChecked(index)} /></td>
                                    <td>{item.community_no}</td>
                                    <td>{item.userid}</td>
                                    <td>{item.community_title}</td>
                                    <td>{item.community_writedate}</td>
                                    <td>{item.hit}</td>
                                    <td>{item.active_state == 1 ? "활성" : "비활성"}</td>
                                    <td>{item.edit_date}</td>
                                    <td>{item.edit_user}</td>
                                    <td>{item.community_like}</td>
                                </tr>
                            )) : (<tr><td colSpan="10">검색한 내용을 포함한 신고내역이 존재하지 않습니다.</td></tr>)}
                        </tbody>
                    </table>
                ) : CommunityActivity === 2 ? (
                    <table className="AdminComMenTable">
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={isAllComChecked}
                                    onChange={handleAllComChecked} /></th>
                                <th>No.</th>
                                <th>작성 위치</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>상태</th>
                                <th>수정일</th>
                                <th>수정인</th>
                                <th>답글 수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {com_com && com_com.length > 0 ? com_com.map((item, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" checked={checkedComments[index]}
                                        onChange={() => handleComChecked(index)} /></td>
                                    <td>{item.comment_no}</td>
                                    <td>{item.community_no}</td>
                                    <td>{item.userid}</td>
                                    <td>{item.comment_content}</td>
                                    <td>{item.comment_writedate}</td>
                                    <td>{item.active_state == 1 ? "활성" : "비활성"}</td>
                                    <td>{item.edit_date}</td>
                                    <td>{item.edit_user}</td>
                                    <td>{item.reply_cnt}</td>
                                </tr>
                            )) : (<tr><td colSpan="10">검색한 내용을 포함한 신고내역이 존재하지 않습니다.</td></tr>)}
                        </tbody>
                    </table>
                ):
                 CommunityActivity === 3 ? (
                    <table className="AdminComMenTable">
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={isAllComChecked}
                                    onChange={handleAllComChecked} /></th>
                                <th>No.</th>
                                <th>작성 위치</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>상태</th>
                                <th>수정일</th>
                                <th>수정인</th>
                                <th>태그한 유저</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reply && reply.length > 0 ? reply.map((item, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" checked={checkedReplies[index]}
                                        onChange={() => handleComChecked(index)} /></td>
                                    <td>{item.reply_no}</td>
                                    <td>{item.comment_no}</td>
                                    <td>{item.userid}</td>
                                    <td>{item.reply_content}</td>
                                    <td>{item.reply_writedate}</td>
                                    <td>{item.active_state == 1 ? "활성" : "비활성"}</td>
                                    <td>{item.edit_date}</td>
                                    <td>{item.edit_user}</td>
                                    <td>{item.tag_usernick}</td>
                                </tr>
                            )) 
                            : (<tr><td colSpan="10">검색한 내용을 포함한 신고내역이 존재하지 않습니다.</td></tr>)}
                        </tbody>
                    </table>
                ):
                (
                    <></>
                )}
            </form>
        </div>
    );
}

export default ComCon;
