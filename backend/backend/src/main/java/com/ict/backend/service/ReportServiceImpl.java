package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.dao.ReportDAO;
import com.ict.backend.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {
    ReportDAO reportDAO;
    @Autowired
    public ReportServiceImpl(ReportDAO reportDAO){
        this.reportDAO = reportDAO;
    }
    public int insertReport(ReportVO reportVO){
        return reportDAO.insertReport(reportVO);
    }
}
