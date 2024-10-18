import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../css/mypage/more.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BsExclamationCircle } from "react-icons/bs";


function More() {

    const { more } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // 데이터 로딩 상태

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;
                if (more === "bookmarked") {
                    // 즐겨찾기 데이터 호출
                    response = await axios.get("http://localhost:9988/user/bookmarks");
                } else if (more === "recentwatch") {
                    // 최근기록 데이터 호출
                    response = await axios.get("http://localhost:9988/user/history");
                }

                if (response && response.data) {
                    console.log(response.data);
                    setData(response.data); // 받아온 데이터를 state에 설정
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // 데이터 로딩 종료
            }
        };

        fetchData();
    }, [more]); // 'more' 값이 변경될 때마다 데이터 호출

    return (
        <div className="More">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "seemoreinfo">
                    <div className = "seemoretitle">
                        <span>{more === "bookmarked" ? "즐겨찾기" : "최근기록"}</span>
                    </div>
                </div>
                <div className = "otherinfo">
                    {data.length > 0 ? (
                    data.map((item, index) => (
                        <div key={index} className="moviecontent">
                            <Link to={`/movies/view/${item.movie_code}`}>
                            <div className="moiveimage">
                                    <img src={item.movie_link} alt="이미지" />
                                    {more === "bookmarked" && (
                                        <button
                                        className="heart"
                                        onClick={(event) => {
                                            event.preventDefault(); // 페이지 이동 막기
                                            alert(`Heart 버튼이 클릭되었습니다! 영화: ${item.title}`);
                                        }}
                                    ></button>
                                        )}
                            </div>
                            <div className="moivetitle">
                                <span>{item.movie_kor}</span>
                            </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="noInfo">
                        <div>
                            <BsExclamationCircle />
                            <p>{more === "bookmarked" ? "즐겨찾기 기록이" : "시청기록이"} 없습니다</p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>

    );
}
export default More;