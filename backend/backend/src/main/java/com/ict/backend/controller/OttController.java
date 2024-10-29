package com.ict.backend.controller;

import com.ict.backend.service.OttService;
import com.ict.backend.vo.OttVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ott")
public class OttController {

    @Autowired
    private OttService ottService;

    @GetMapping("/{movieCode}")
    public List<OttVO> getOttByMovieCode(@PathVariable String movieCode) {
        int movieNo = ottService.getMovieNoByCode(movieCode);  // movie_code로 movie_no 조회
        return ottService.getOttInfoByMovieNo(movieNo);  // movie_no로 OTT 정보 조회
    }
}
