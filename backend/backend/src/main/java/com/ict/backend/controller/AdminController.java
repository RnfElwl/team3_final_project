package com.ict.backend.controller;

import com.ict.backend.service.AdminService;
import com.ict.backend.vo.AdminDateVO;
import com.ict.backend.vo.AdminVO;
import com.ict.backend.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {
    @Autowired
    AdminService adminService;

    @GetMapping("/minDatas")
    public Map<String, Integer> admin_mindata(){
        Map<String, Integer> minMap=new HashMap<>();
      //오늘 가입한 인원수
        int dailySub=adminService.dailySubscriberSelect();
      //오늘 작성한 커뮤니티글 수
        int dailyCom=adminService.dailyCommunitySelect();
      //오늘 작성한 문의글 수
        int dailyQna=adminService.dailyQnaSelect();
      //오늘 신고 수
        int dailyRep=adminService.dailyRepSelect();

        minMap.put("dSubscriber",dailySub);
        minMap.put("dCommunity",dailyCom);
        minMap.put("dQna",dailyQna);
        minMap.put("dRep",dailyRep);

      System.out.println("Result: "+minMap);
      return minMap;
    };
    @GetMapping("/qna_dashboard/{qna_filter}")
    public List<AdminVO> qna_dashboard(@PathVariable String qna_filter){
        List<AdminVO> qnaDataList=new ArrayList<>();

        switch (qna_filter) {
            case "월":
                qnaDataList = adminService.qnaDataSelectMonth();
                break;
            case "년":
                qnaDataList = adminService.qnaDataSelectYear();
                break;
            case "일":
                qnaDataList = adminService.qnaDataSelectDay();
                break;
            default:
                log.error("Invalid qna_filter: {}", qna_filter);
                // Optional: 예외를 던지거나 빈 리스트를 반환
                return new ArrayList<>();
        }
        log.info(qnaDataList.toString());
        return qnaDataList;
    }
    @GetMapping("/community_dashboard/{community_filter}")
    public List<AdminVO> community_dashboard(@PathVariable String community_filter){
        List<AdminVO> communityDataList=new ArrayList<>();

        switch (community_filter) {
            case "월":
                communityDataList = adminService.communityDataSelectMonth();
                break;
            case "년":
                communityDataList = adminService.communityDataSelectYear();
                break;
            case "일":
                communityDataList = adminService.communityDataSelectDay();
                break;
            default:
                log.error("Invalid community_filter: {}", community_filter);
                // Optional: 예외를 던지거나 빈 리스트를 반환
                return new ArrayList<>();
        }
        log.info(communityDataList.toString());
        return communityDataList;
    }
    @PostMapping("/qna_searchChart/")
    public List<AdminVO> qna_searchChart(@RequestBody AdminDateVO dateList){
        System.out.println("수정폼 도착"+dateList);
        System.out.println("시작일:"+dateList);

        return adminService.qnaSearch(dateList);
    }
    @PostMapping("/com_searchChart/")
    public List<AdminVO> com_searchChart(@RequestBody AdminDateVO dateList){
        System.out.println("수정폼 도착"+dateList);
        System.out.println("시작일:"+dateList);

        return adminService.comSearch(dateList);
    }
    //멤버목록 확인
    @GetMapping("/mem_dashboard")
    public List<MemberVO> getMemberList(){
        List<MemberVO> result=adminService.selectMemberMin();

        return result;
    }

}
