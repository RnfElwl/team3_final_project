import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminComCon.css';

function ComCon(){
    const [CommunityActivity, setCommunityActivity]=useState(0);
    const [Community, setCommunity]=useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchKey, setSearchKey]=useState('');
    const [searchWord, setSearchWord]=useState('');
    const [active_state, setActive_state]=useState('');
    const [orderColumn, setOrderColumn]=useState('');
    const [orderType, setOrderType]=useState('');
    const navigate = useNavigate();
    //전체페이지
    const totalPage = Math.ceil(totalRecord / 12);
    //페이지네이션
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };

    const comUrl = `http://localhost:9988/admin/comList?nowPage=${nowPage}`// + 
    // `&searchKey=${searchKey}` + 
    // `&searchWord=${encodeURIComponent(searchWord)}` + 
    // `&active_state=${active_state}` + 
    // `&orderColumn=${orderColumn}` + 
    // `&orderType=${orderType}`;

    //커뮤니티 탭
    const handleComTap=(e) => {
        e.preventDefault();
        setCommunityActivity(e.target.value);
    };

    useEffect(() => {
        axios.get(`http://localhost:9988/admin/comList?nowPage=${nowPage}&searchKey=${searchKey || ''}&searchWord=${encodeURIComponent(searchWord || '')}`)
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
                (<div>
                    글입니다.
                </div>):
                (<div>
                    댓글입니다.
                </div>)}
        </div>
    );
}

export default ComCon;