import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/mypage/find.css';

function Success() {
    const location = useLocation();
    const { foundId, message } = location.state || {};

    const maskId = (id) => {
        if (id && id.length > 3) {
            return id.slice(0, 3) + '*'.repeat(id.length - 3);
        }
        return id;
    };

    const handleClose = () => {
        window.close();
    };

    return (
        <div className="success-page">
            {foundId ? (
                <div>
                    <h3>아이디 찾기 결과:</h3>
                    <p>아이디: {maskId(foundId)}</p>
                </div>
            ) : (
                <div>
                    <h3>{message}</h3>
                </div>
            )}
            <button className="btn btn-secondary" onClick={handleClose}>닫기</button>
        </div>
    );
}

export default Success;
