package com.ict.backend.service;

import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import java.util.List;

public interface CommunityService {

    // 게시글 리스트 조회 메서드
    List<CommunityVO> getCommunityList();

    //게시글 작성
    int createCommunity(CommunityVO vo);

    //view
    CommunityVO getCommunityView(int community_no);

    //edit
    void editCommunity(CommunityVO community);

    void deleteCommentsByCommunityNo(int community_no);

    void deleteCommunity(int community_no);

    //like
    void likeCommunity(CommunityLikeVO like);
    int getLikesCount(int community_no);
}