import axios from 'axios';
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:9988`;
// const BASE_URL = 'http://192.168.1.88:9988';
// const BASE_URL = 'http://192.168.1.87:9988';
// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: "http://localhost:9988"
    // baseURL: "http://192.168.1.88:9988"
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
    config => {
        // '/reissue' 요청은 인터셉터에서 액세스 토큰을 추가하지 않도록 합니다.
        if (config.url !== '/reissue') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
         if (config.url.startsWith('http://localhost:9988')) {
             config.url = config.url.replace('http://localhost:9988', BASE_URL);
         }
        console.log("config = " + config);
        return config;
    },
    error => Promise.reject(error)
);


const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await instance.post('/reissue', null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const token = response.headers['authorization'] || response.headers['Authorization'];
        const pureToken = token.split(' ')[1];
        localStorage.setItem('token', pureToken);
        return pureToken;
    } catch (error) {
        // 에러 응답을 확인합니다.
        if (error.response && error.response.data === 'refresh token expired') {
            // 리프레시 토큰이 만료된 경우 로그아웃 처리
            logout();
        } else {
            // 다른 종류의 에러 처리
            console.error('An error occurred:', error);
        }
    }
};

const logout = () => {
    // 로컬 스토리지의 모든 항목을 비웁니다.
    localStorage.clear();
    // 로그인 페이지로 리다이렉트
    window.location.href = '/signin';
};




// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => response, // 정상 응답
    async (error) => {
        const originalRequest = error.config;

        // 401 오류가 발생하고, 이미 재시도를 한 적이 없다면
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 했음을 표시

            // 토큰을 갱신하고 재시도
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // 원래 요청을 다시 수행
            return instance(originalRequest);
        }
        if (error.response && error.response.status === 401) {
            alert("로그인 후 접속해주세요");
            window.location.href = '/signin';
        }
        if (error.response && error.response.status === 403) {
            alert("접근 권한이 없습니다. 로그인 후 접속해주세요.");
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default instance;
