package com.ict.backend.service;

import com.ict.backend.vo.AdminVO;

import java.util.List;

public interface AdminService {
    public List<AdminVO> qnaDataSelectMonth();
    public List<AdminVO> qnaDataSelectYear();
    public List<AdminVO> qnaDataSelectDay();
}
