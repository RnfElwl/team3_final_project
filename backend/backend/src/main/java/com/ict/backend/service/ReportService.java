package com.ict.backend.service;

import com.ict.backend.dao.ReportDAO;
import com.ict.backend.vo.ReportVO;

public interface ReportService {
    public int insertReport(ReportVO reportVO);
}
