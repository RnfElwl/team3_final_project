import { Navigate, Outlet } from "react-router-dom";

// 로컬 스토리지에서 JWT 토큰 가져오기
const token = window.localStorage.getItem("jwtToken");  // "jwtToken"은 저장된 토큰의 키

// 토큰이 있는지 여부를 확인하는 함수 (간단한 유효성 확인 포함)
const isTokenValid = (token) => {
    if (!token) {
        return false; // 토큰이 없으면 false
    }
    
    try {
        // base64로 인코딩된 JWT의 payload 부분을 디코딩 (단순 유효성 확인)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // 현재 시간이 토큰의 만료 시간보다 작으면 유효함
        const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초)
        if (payload.exp && currentTime > payload.exp) {
            return false; // 토큰이 만료됨
        }
        return true;
    } catch (e) {
        return false; // 토큰 파싱 오류 시 유효하지 않음
    }
};

const isLogin = isTokenValid(token);  // 토큰 유효성 체크

const PrivateRoute = () => {
    return isLogin ? <Outlet /> : <Navigate to="/login" />; // 토큰이 있으면 접근 허용, 없으면 로그인 페이지로 이동
};

export default PrivateRoute;
