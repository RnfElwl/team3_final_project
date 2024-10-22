import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/find.css';
function Find() {

    const { type } = useParams();
    
    return (
        <div className="User">
            <div className="container">
                <div>{type}</div>
            </div>
        </div>

    );
}
export default Find;