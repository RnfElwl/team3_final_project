package com.ict.backend.controller;

import com.ict.backend.service.AdminService;
import com.ict.backend.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public Map<String, Integer> admin_mindata() {
        Map<String, Integer> minMap = new HashMap<>();
        //오늘 가입한 인원수
        int dailySub = adminService.dailySubscriberSelect();
        //오늘 작성한 커뮤니티글 수
        int dailyCom = adminService.dailyCommunitySelect();
        //오늘 작성한 문의글 수
        int dailyQna = adminService.dailyQnaSelect();
        //오늘 신고 수
        int dailyRep = adminService.dailyRepSelect();

        minMap.put("dSubscriber", dailySub);
        minMap.put("dCommunity", dailyCom);
        minMap.put("dQna", dailyQna);
        minMap.put("dRep", dailyRep);

        System.out.println("Result: " + minMap);
        return minMap;
    }

    ;

    @GetMapping("/qna_dashboard/{qna_filter}")
    public List<AdminVO> qna_dashboard(@PathVariable String qna_filter) {
        List<AdminVO> qnaDataList = new ArrayList<>();

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
    public List<AdminVO> community_dashboard(@PathVariable String community_filter) {
        List<AdminVO> communityDataList = new ArrayList<>();

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
    public List<AdminVO> qna_searchChart(@RequestBody AdminDateVO dateList) {
        System.out.println("수정폼 도착" + dateList);
        System.out.println("시작일:" + dateList);

        return adminService.qnaSearch(dateList);
    }

    @PostMapping("/com_searchChart/")
    public List<AdminVO> com_searchChart(@RequestBody AdminDateVO dateList) {
        System.out.println("수정폼 도착" + dateList);
        System.out.println("시작일:" + dateList);

        return adminService.comSearch(dateList);
    }

    //멤버목록 확인
    @GetMapping("/mem_dashboard")
    public List<MemberVO> getMemberList() {
        List<MemberVO> result = adminService.selectMemberMin();

        return result;
    }

    //QnA Management part
    @GetMapping("/qnaList")
    public ResponseEntity<Map<String, Object>> getAdminQnAList(@ModelAttribute PagingVO pagingVO) {
        System.out.println("Input: " + pagingVO);
        System.out.println("Search Key: " + pagingVO.getSearchKey());  // Log check
        System.out.println("Search Word: " + pagingVO.getSearchWord());  // Log check

        List<QnAVO> result = adminService.getQnAList(pagingVO);
        int qnaTotalPages = adminService.getTotalQnARecord(pagingVO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("qnaList", result);
        resultMap.put("qnaTotalPages", qnaTotalPages);
        System.out.println("Result: " + resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @PostMapping("/qnaAnswerWrite/{qna_no}")
    public int qnaAnswerWrite(@PathVariable int qna_no, @RequestBody QnAVO adminQAData) {
        adminQAData.setQna_no(qna_no);
        return adminService.insertQnaAnswer(adminQAData);
    }

    //qna active state Management
    @PostMapping("/qnaActiveEdit")
    public int qnaActiveEdit(
            @RequestParam("active_state") Integer activeState,
            @RequestParam("qna_no") List<Integer> qnaNos) {
        System.out.println("Active State: " + activeState);
        System.out.println("Qna Numbers: " + qnaNos);

        adminService.updateQnaActive(activeState, qnaNos);

        return 1;
    }

    //Member ManageMent Part
    @GetMapping("/MemList")
    public ResponseEntity<Map<String, Object>> MemList(@ModelAttribute PagingVO pagingVO) {
        List<MemberVO> result = adminService.getMemList(pagingVO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("memList", result);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
    @PostMapping("/memActiveEdit")
    public int memActiveEdit(
            @RequestParam("active_state") Integer activeState,
            @RequestParam("userid") List<String> userids) {
        System.out.println("Active State: " + activeState);
        System.out.println("Mem userid: " + userids);

        adminService.updateMemActive(activeState, userids);

        return 1;
    }

    //Report ManageMent Part
    @GetMapping("/repList")
    public ResponseEntity<Map<String, Object>> RepList(@ModelAttribute PagingVO pagingVO) {
        List<ReportVO> result = adminService.getRepList(pagingVO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("repList", result);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
    @GetMapping("/getReport/{report_no}")
    public ResponseEntity<List<ReportVO>> getRep(@PathVariable int report_no){

        List<ReportVO> reportList=adminService.getRepView(report_no);
        return new ResponseEntity<>(reportList, HttpStatus.OK);
    }

    @GetMapping("/comList")
    public ResponseEntity<Map<String, Object>> ComList(@ModelAttribute PagingVO pagingVO){
        pagingVO.setOnePageRecord(7);
        List<CommunityVO> result=adminService.getComList(pagingVO);
        int comTotalPages = adminService.getTotalComRecord(pagingVO);
        System.out.println("Input: " + pagingVO);
        System.out.println("Search Key: " + pagingVO.getSearchKey());  // Log check
        System.out.println("Search Word: " + pagingVO.getSearchWord());  // Log check



        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("comList", result);
        resultMap.put("comTotalPages", comTotalPages);
        System.out.println("Result: " + resultMap);

        return new ResponseEntity<>(resultMap,HttpStatus.OK);
    }
    @GetMapping("/movieList")
    public ResponseEntity<List<MovieVO>> selectAdminMovieList(MovieVO movieVO){
        System.out.println(movieVO.toString());
        List<MovieVO> movieList = adminService.selectAdminMovieList(movieVO);
        return new ResponseEntity<>(movieList, HttpStatus.OK);
    }
    @PostMapping("/movieActiveEdit")
    public int movieActiveEdit(@RequestParam Integer active_state, @RequestParam List<Integer> movie_no) {
        System.out.println("Active State: " + active_state);
        System.out.println("Mem userid: " + movie_no);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return adminService.updateMovieActive(active_state, movie_no, userid);
    }
}
