package com.ict.backend.service;

import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import com.ict.backend.vo.PagingVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommunityService {

//    int totalRecord(PagingVO pVO);

    // 게시글 리스트 조회 메서드
    //Page<CommunityVO> getCommunityList(Pageable pageable);
    List<CommunityVO> getCommunityList(String userid, String sortType, String categoryType);
//    List<CommunityVO> getCommunityList(@Param("size") int size, @Param("offset") int offset);
//    int getTotalCount(); // 총 게시물 수를 가져오는 메서드

    //게시글 작성
    int createCommunity(CommunityVO vo);

    //view
    CommunityVO getCommunityView(int community_no, String userid);
    void increaseHit(int community_no);
    List<CommunityVO> getTopViewedPosts();

    //edit
    void editCommunity(CommunityVO community);

    void deleteCommentsByCommunityNo(int community_no);

    void deleteCommunity(int community_no);

    //like
    int isLiked(CommunityLikeVO like);

    void likeCommunity(CommunityLikeVO like);

    void unlikeCommunity(CommunityLikeVO like);

    int getLikesCount(int community_no);

    int uploadImage(String imageUrl);

    public int updateimageurl(String imgurl, int profileno);

    int getimgno(int community_no);

}