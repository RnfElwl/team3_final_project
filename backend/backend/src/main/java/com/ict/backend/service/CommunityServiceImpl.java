package com.ict.backend.service;

import com.ict.backend.dao.CommunityDAO;
import com.ict.backend.vo.CommunityVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class CommunityServiceImpl implements CommunityService{
    @Inject
    CommunityDAO dao;

    @Override
    public int communityInsert(CommunityVO community) {
        return dao.communityInsert(community);
    }
}