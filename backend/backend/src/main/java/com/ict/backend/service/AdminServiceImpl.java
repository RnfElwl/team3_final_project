package com.ict.backend.service;

import com.ict.backend.dao.AdminDAO;
import com.ict.backend.vo.AdminDateVO;
import com.ict.backend.vo.AdminVO;
import com.ict.backend.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService{
    @Autowired
    AdminDAO dao;


    @Override
    public List<AdminVO> qnaDataSelectMonth() {
        return dao.qnaDataSelectMonth();
    }

    @Override
    public List<AdminVO> qnaDataSelectYear() {
        return dao.qnaDataSelectYear();
    }

    @Override
    public List<AdminVO> qnaDataSelectDay() {
        return dao.qnaDataSelectDay();
    }

    @Override
    public List<AdminVO> communityDataSelectMonth() {
        return dao.communityDataSelectMonth();
    }

    @Override
    public List<AdminVO> communityDataSelectYear() {
        return dao.communityDataSelectYear();
    }

    @Override
    public List<AdminVO> communityDataSelectDay() {
        return dao.communityDataSelectDay();
    }

    @Override
    public List<AdminVO> qnaSearch(AdminDateVO dateList) {
        return dao.qnaSearch(dateList);
    }

    @Override
    public List<AdminVO> comSearch(AdminDateVO dateList) {
        return dao.comSearch(dateList);
    }

    @Override
    public int dailySubscriberSelect() {
        return dao.dailySubscriberSelect();
    }

    @Override
    public int dailyCommunitySelect() {
        return dao.dailyCommunitySelect();
    }

    @Override
    public int dailyQnaSelect() {
        return dao.dailyQnaSelect();
    }

    @Override
    public int dailyRepSelect() {
        return dao.dailyRepSelect();
    }

    @Override
    public List<MemberVO> selectMemberMin() {
        return dao.selectMemberMin();
    }


}
