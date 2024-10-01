package com.ict.backend.service;

import com.ict.backend.dao.CommunityDAO;
import com.ict.backend.vo.CommunityVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class CommunityServiceImpl implements CommunityService{
    @Inject
    CommunityDAO dao;

    @Override
    public List<CommunityVO> getCommunityList() {
        return dao.getCommunityList();
    }

    @Override
    public int createCommunity(CommunityVO vo) {
        return dao.createCommunity(vo);
    }

    @Override
    public CommunityVO getCommunityView(int community_no) {
        return dao.getCommunityView(community_no);
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

}