  // 엑셀 다운받는 axios
import axios from 'axios';

export const downloadExcelFile = async () => {
    try {
        const response = await axios.get('http://localhost:9988/movie_info', {
            responseType: 'blob', // blob으로 응답을 받도록 설정
        });

        // blob 데이터를 사용하여 파일 생성
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'movies.xlsx'); // 다운로드할 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 링크 제거
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};