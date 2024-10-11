package com.ict.backend.dao;

import com.ict.backend.vo.AdminDateVO;
import com.ict.backend.vo.AdminVO;

import java.util.List;

public interface AdminDAO {
    public List<AdminVO> qnaDataSelectMonth();
    public List<AdminVO> qnaDataSelectYear();
    public List<AdminVO> qnaDataSelectDay();
    public List<AdminVO> communityDataSelectMonth();
    public List<AdminVO> communityDataSelectYear();
    public List<AdminVO> communityDataSelectDay();
    public List<AdminVO> qnaSearch(AdminDateVO dateList);
    public List<AdminVO> comSearch(AdminDateVO dateList);
}
