import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminComCon.css';

function ComCon(){
    const [CommunityActivity, setCommunityActivity]=useState(0);

    const handleComTap=(e) => {
        e.preventDefault();
        setCommunityActivity(e.target.value);  // 상태가 바뀌면 컴포넌트가 다시 렌더링되어 또 상태를 업데이트...
    }; 

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