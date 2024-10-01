package com.ict.backend.controller;

import com.ict.backend.service.AdminService;
import com.ict.backend.vo.AdminVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/adminTest")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {
    @Autowired
    AdminService adminService;

    @GetMapping("/dashboard")
    public List<AdminVO> dashboard(){
        List<AdminVO> dataList=adminService.adminDataSelectSeason();
        log.info(dataList.toString());
        return dataList;
    }
}
