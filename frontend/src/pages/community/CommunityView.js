// import "../../css/community/communityView.css";
// import React, { useState, useEffect } from 'react';
// import axios from "axios";
// import { Link } from 'react-router-dom';

// function CommunityView(){
//     const [community, setCommunity] = useState([]);

//     // category 값에 따른 카테고리 이름을 반환하는 함수
//     const getCategoryName = (category) => {
//         switch (category) {
//             case 0:
//                 return "영화";
//             case 1:
//                 return "일상";
//             case 2:
//                 return "자유";
//             case 3:
//                 return "포스터";
//             default:
//                 return "기타";
//         }
//     };

//     useEffect(() => {
//         axios.get('http://localhost:9988/community/view')
//             .then(response => {
//                 setCommunity(response.data); // community 상태 업데이트
//             })
//             .catch(error => {
//                 console.error("Error fetching community view:", error);
//             });
//     }, []);

//     return(
//         <div className="community_view">
//             <div className="view_top">
//                 <img className="writer_image" src={communityItem.writerImage} alt="Writer" />
//                 <div className="writer_info">
//                     <p className="writer_name">{communityItem.userid}</p>
//                     <p className="writedate">{communityItem.community_writedate}</p>
//                 </div>
//                 <input type="button" value="팔로우" className="action_button" />
//                 <input type="button" value="신고" className="action_button" />
//             </div> 
//             <div className="view_middle">
//                 <div className="category">{getCategoryName(communityItem.category)}</div>
//                 <h3 className="community_title">{communityItem.community_title}</h3>
//                 {communityItem.community_img && (
//                     <img className="community_img" src={communityItem.community_img} alt="Uploaded" />
//                 )}
//             </div>

//             <div className="view_bottom">
//                 <i className="like-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> ♡</i>
//                 <span className="likeCount">{communityItem.likeHit}</span>
//                 <i className="comment-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 💬</i>
//                 <span className="commentCount">{communityItem.commentHit}</span>
//                 <i className="bookmark-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 🔖</i>
//             </div>          
//         </div>
//     );
// }
// export default CommunityView;