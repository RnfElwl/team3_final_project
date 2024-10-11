package com.ict.backend.service;

import com.ict.backend.dao.CommunityDAO;
import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import com.ict.backend.vo.PagingVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class CommunityServiceImpl implements CommunityService{
    @Inject
    CommunityDAO dao;

//    @Override
//    public Page<CommunityVO> getCommunityList(Pageable pageable) {
//        return dao.getCommunityList(pageable);
//    }
    @Override
    public List<CommunityVO> getCommunityList() {
        return dao.getCommunityList();
    }

//    @Override
//    public List<CommunityVO> getCommunityList(int size, int offset) {
//        return dao.getCommunityList(size,offset);
//    }
//
//    @Override
//    public int getTotalCount() {
//        return dao.getTotalCount();
//    }

    @Override
    public int createCommunity(CommunityVO vo) {
        return dao.createCommunity(vo);
    }

    @Override
    public CommunityVO getCommunityView(int community_no) {
        return dao.getCommunityView(community_no);
    }

    @Override
    public void increaseHit(int community_no) {
        dao.increaseHit(community_no);
    }

    @Override
    public List<CommunityVO> getTopViewedPosts() {
        return dao.getTopViewedPosts();
    }

    @Override
    public void editCommunity(CommunityVO community) {
        dao.editCommunity(community);
    }

    @Override
    public void deleteCommentsByCommunityNo(int community_no) {
        dao.deleteCommentsByCommunityNo(community_no);
    }

    @Override
    public void deleteCommunity(int community_no) {
        dao.deleteCommunity(community_no);
    }

    @Override
    public int isLiked(CommunityLikeVO like) {
        return dao.isLiked(like);
    }

    @Override
    public void likeCommunity(CommunityLikeVO like) {
        dao.likeCommunity(like);
    }

    @Override
    public void unlikeCommunity(CommunityLikeVO like) {
        dao.unlikeCommunity(like);
    }

    @Override
    public int getLikesCount(int community_no) {
        return dao.getLikesCount(community_no);
    }

}