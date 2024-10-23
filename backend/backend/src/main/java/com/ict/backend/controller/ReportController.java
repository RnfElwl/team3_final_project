package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.service.ReportService;
import com.ict.backend.vo.ChatVO;
import com.ict.backend.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/report")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {
    private ReportService reportService;
    @Autowired
    public ReportController(ReportService reportService){
        this.reportService = reportService;
    }

    @PostMapping("/submit")
    public int insertReport(@RequestBody ReportVO reportVO){
        reportVO.setReport_userid(SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println(reportVO.toString());
        return reportService.insertReport(reportVO);
        
    }
}
