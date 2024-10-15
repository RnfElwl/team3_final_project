package com.ict.backend.dao;

import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.PagingVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommunityDAO {

//    int totalRecord(PagingVO pVO);

    // 게시글 리스트 조회 메서드
//    Page<CommunityVO> getCommunityList(Pageable pageable);
    List<CommunityVO> getCommunityList();
//    List<CommunityVO> getCommunityList(@Param("size") int size, @Param("offset") int offset);
//    int getTotalCount(); // 총 게시물 수를 가져오는 메서드

    //게시글 작성
    int createCommunity(CommunityVO vo);

    //view
    CommunityVO getCommunityView(int community_no);
    void increaseHit(int community_no);
    List<CommunityVO> getTopViewedPosts();

    void editCommunity(CommunityVO community);

    void deleteCommentsByCommunityNo(int community_no);

    void deleteCommunity(int community_no);

    int isLiked(CommunityLikeVO like);

    void likeCommunity(CommunityLikeVO like);

    void unlikeCommunity(CommunityLikeVO like);

    int getLikesCount(int community_no);

    void uploadImage(ImageVO imageVO);

    int updateimageurl(String imgurl, int profileno);

    int getimgno(int community_no);


}