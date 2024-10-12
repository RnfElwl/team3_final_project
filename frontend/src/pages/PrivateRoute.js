import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from '../component/api/axiosApi';

const PrivateRoute = () => {
    const [loading, setLoading] = useState(true);
    const [accessStatus, setAccessStatus] = useState(null);
    
    const token = window.localStorage.getItem("token");
    const apiPath = "http://localhost:9988/protected-resource"; // 고정된 API 경로

    useEffect(() => {
        const checkAccess = async () => {
            if (!token) {
                setAccessStatus('UNAUTHORIZED');
            } else {
                try {
                    await axios.get(apiPath); // API 호출
                    setAccessStatus('AUTHORIZED'); // 접근 허용
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 403) {
                            setAccessStatus('FORBIDDEN'); // 권한 없음
                        } else if (error.response.status === 401) {
                            setAccessStatus('UNAUTHORIZED'); // 인증 필요
                        }
                    }
                }
            }
            setLoading(false);
        };

        checkAccess();
    }, [token]); // apiPath는 고정되므로 의존성 배열에서 제외

    if (loading) {
        return <div>Loading...</div>;
    }

    if (accessStatus === 'UNAUTHORIZED') {
        return <Navigate to="/login" />; // 로그인 페이지로 이동
    }

    if (accessStatus === 'FORBIDDEN') {
        return <Outlet />; // 접근 허용 (mypage 등)
    }

    return <Outlet />; // 접근 허용
};

export default PrivateRoute;
