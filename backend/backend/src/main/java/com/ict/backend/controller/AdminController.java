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

    //qna active state Management Part
    @PostMapping("/qnaActiveEdit")
    public int qnaActiveEdit(
            @RequestParam("active_state") Integer activeState,
            @RequestParam("qna_no") List<Integer> qnaNos) {
        System.out.println("Active State: " + activeState);
        System.out.println("Qna Numbers: " + qnaNos);

        int updatedCount =  adminService.updateQnaActive(activeState, qnaNos);

        return updatedCount;
    }

    //Member Management Part
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

        int updatedCount = adminService.updateMemActive(activeState, userids);

        return updatedCount;
    }
    //Banned Member Management Part
    @GetMapping("/banMemList")
    public ResponseEntity<Map<String, Object>> BanMemList(@ModelAttribute PagingVO pagingVO) {
        List<BanVO> result = adminService.getBanMemList(pagingVO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("banMemList", result);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
    @PostMapping("/banMemActiveEdit")
    public int banMemActiveEdit(
            @RequestParam("active_state") Integer activeState,
            @RequestParam("userid") List<String> userids) {
        System.out.println("Active State: " + activeState);
        System.out.println("UserIds: " + userids);

        int updatedCount =  adminService.updateMemActive(activeState, userids);

        if(activeState==1){
            adminService.deleteBanHistory(userids);
        }
        return updatedCount;
    }

    //Report Management Part
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
    @GetMapping("/getBanData/{reported_userid}")
    public ResponseEntity<List<BanVO>> getBanData(@PathVariable String reported_userid){
        List<BanVO> BanList=adminService.getBanData(reported_userid);
        return new ResponseEntity<>(BanList, HttpStatus.OK);
    }
//    정지 기간 수정
    @PostMapping("/editBanDate")
    public int editBanDates(@RequestBody BanVO banData){
        int updateBanCnt= adminService.updateBanDateWrite(banData);

        return updateBanCnt;
    }

    //Community Management Part
    @GetMapping("/comList")
    public ResponseEntity<Map<String, Object>> ComList(@ModelAttribute PagingVO pagingVO){
        System.out.println(pagingVO.toString());
        Map<String, Object> resultMap = new HashMap<>();
        int comTotalPages =0;
        int comMenTotalPages =0;
        int comReplyTotalPages =0;
        if(pagingVO.getTabActive()==1){
        List<CommunityVO> result=adminService.getComList(pagingVO);
        resultMap.put("comList", result);
            comTotalPages = adminService.getTotalComRecord(pagingVO);
        }
        else if(pagingVO.getTabActive()==2) {
            List<CommentVO> resultCo = adminService.getComMenList(pagingVO);
            resultMap.put("comMenList", resultCo);
            comMenTotalPages=adminService.getTotalComMenRecord(pagingVO);
        }
        else if(pagingVO.getTabActive()==3) {
            List<CommentReplyVO> resultre = adminService.getReplyList(pagingVO);
            resultMap.put("replyList", resultre);
            comReplyTotalPages=adminService.getTotalComRepRecord(pagingVO);
        }
        else{
            List<CommunityVO> result=adminService.getComList(pagingVO);
            resultMap.put("comList", result);
            List<CommentVO> resultCo = adminService.getComMenList(pagingVO);
            resultMap.put("comMenList", resultCo);
            List<CommentReplyVO> resultre = adminService.getReplyList(pagingVO);
            resultMap.put("replyList", resultre);
            comTotalPages = adminService.getTotalComRecord(pagingVO);
            comMenTotalPages=adminService.getTotalComMenRecord(pagingVO);
            comReplyTotalPages=adminService.getTotalComRepRecord(pagingVO);
        }

//        System.out.println("Input: " + pagingVO);
//        System.out.println("Search Key: " + pagingVO.getSearchKey());  // Log check
//        System.out.println("Search Word: " + pagingVO.getSearchWord());  // Log check




        resultMap.put("comTotalPages", comTotalPages);
        resultMap.put("comMenTotalPages",comMenTotalPages);
        resultMap.put("comRepTotalPages",comReplyTotalPages);
//        System.out.println("Result: " + resultMap);

        return new ResponseEntity<>(resultMap,HttpStatus.OK);
    }
    @PostMapping("/comActiveEdit")
    public int comActiveEdit(
            @RequestParam(value = "community_no", required = false) List<Integer> communityNos,
            @RequestParam(value = "comment_no", required = false) List<Integer> commentNos,
            @RequestParam(value = "reply_no", required = false) List<Integer> replyNos,
            @RequestParam("active_state") int activeState) {

        int updatedCount=0;
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();

        if (communityNos != null && !communityNos.isEmpty()) {
            updatedCount=adminService.updateCommunityState(userid,communityNos, activeState);

        }

        // Update comment state if comment numbers are provided
        if (commentNos != null && !commentNos.isEmpty()) {
            updatedCount=adminService.updateCommentState(userid,commentNos, activeState);
        }

        // Update reply state if reply numbers are provided
        if (replyNos != null && !replyNos.isEmpty()) {
            updatedCount=adminService.updateReplyState(userid,replyNos, activeState);
        }


        return updatedCount;

    }
    @PostMapping("/repAnsWrite/{report_no}")
    public int RepManagement(@PathVariable("report_no") Integer report_no,
                             @RequestBody Map<String, Object> requestBody) {
        Map<String, Object> updateData = (Map<String, Object>) requestBody.get("updateData");
        Map<String, Object> insertData = (Map<String, Object>) requestBody.get("insertData");

        System.out.println(updateData);
        System.out.println(insertData);

        String edit_user = String.valueOf(updateData.get("edit_user"));
        Integer edit_state = Integer.valueOf(String.valueOf(updateData.get("edit_state")));
        Integer active_state = Integer.valueOf(String.valueOf(updateData.get("active_state")));
        //추가 데이터
        String reported_userid = String.valueOf(insertData.get("reported_userid"));
        String start_banDate = String.valueOf(insertData.get("start_banDate"));
        String stop_banDate = String.valueOf(insertData.get("stop_banDate"));
        String banContent = String.valueOf(insertData.get("banContent"));

        BanVO banvo = new BanVO();
        banvo.setUserid(reported_userid);
        banvo.setStart_banDate(start_banDate);
        banvo.setStop_banDate(stop_banDate);
        banvo.setBanContent(banContent);

        System.out.println("edit_state type: " + updateData.get("edit_state").getClass().getName());
        System.out.println("active_state type: " + updateData.get("active_state").getClass().getName());


        int updateCnt = adminService.updateUserReport(report_no, edit_user, active_state, edit_state);
        int banChk = adminService.banChk(reported_userid);

        System.out.println("업데이트 횟수:" + updateCnt);
        System.out.println("밴테이블에 있는지 카운트:" + banChk);
        if (active_state != 0) {
            if (banChk > 0) {//밴테이블에 동일한 reported_user가 있을 때
                System.out.println(banvo);
                int updateBanCnt=adminService.updateUserBan(banvo);
                System.out.println("정지 업데이트 됨"+updateBanCnt);
            } else { //밴테이블에 동일한 reported_user가 없을때
                int insertBanCnt = adminService.insertUserBan(banvo);
                int updateMemActive=adminService.updateMemActiveOne(2,reported_userid);
                System.out.println("정지 추가 됨"+insertBanCnt);
                System.out.println("유저 활동 변경됨"+updateMemActive);
            }
        }

        return updateCnt;
    }
    //Notice Management Part
    @PostMapping("/notice/write")
    public int noticeWrite(@RequestBody NoticeVO noticeVO){
        System.out.println(noticeVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        noticeVO.setUserid(userid);
        noticeVO.setActive_state(1);

        return adminService.insertNotice(noticeVO);
    }
    @GetMapping("/noticeList")
    public ResponseEntity<List<NoticeVO>> selectAdminNoticeList(NoticeVO qnoVO){
        System.out.println(qnoVO.toString());
        List<NoticeVO> qNoticeList=adminService.selectAdminNoticeList(qnoVO);
        return new ResponseEntity<>(qNoticeList, HttpStatus.OK);
    }
    @GetMapping("/notice/{no}")
    public List<NoticeVO> selectNotice(@PathVariable("no") int no){
        System.out.println(no);
        return adminService.getNotice(no);
    }
    @PostMapping("/notice/edit")
    public int noticeEdit(@RequestBody NoticeVO noticeVO){
        System.out.println(noticeVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        noticeVO.setUserid(userid);
        noticeVO.setActive_state(2);

        return adminService.updateNotice(noticeVO);
    }
    @PostMapping("/noticeActiveEdit")
    public int noticeActiveEdit(@RequestParam Integer active_state, @RequestParam List<Integer> notice_no) {
        System.out.println("Active State: " + active_state);
        System.out.println("Mem userid: " + notice_no);
        return adminService.updateNoticeActive(active_state, notice_no);
    }
    @GetMapping("/movieList")
    public ResponseEntity<List<MovieVO>> selectAdminMovieList(MovieVO movieVO){
        System.out.println("데이터");
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
    @PostMapping("/movie/edit")
    public int movieDataUpdate(@RequestBody MovieVO movieVO){
        System.out.println(movieVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        movieVO.setEdit_user(userid);
        return adminService.updateMovieData(movieVO);
    }
    @GetMapping("/eventList")
    public ResponseEntity<List<EventVO>> selectEventList(EventVO eventVO){
        List<EventVO> eventList=adminService.selectAdminEventList(eventVO);

        return new ResponseEntity<>(eventList,HttpStatus.OK);
    }
    @GetMapping("/eventInMem/{no}")
    public List<EventFCVO> selectEventMem(@PathVariable("no")int event_no){
        List<EventFCVO> eventMemList=adminService.selectEventMemList(event_no);

        return eventMemList;
    }
    @PostMapping("/event/write")
    public int eventWrite(@RequestBody EventVO eventVO){
        System.out.println(eventVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        eventVO.setEvent_editer(userid);
        eventVO.setEvent_active_state(1);

        return adminService.insertEvent(eventVO);
    }
    @GetMapping("/event/{no}")
    public List<EventVO> selectEvent(@PathVariable("no") int no){
        System.out.println(no);
        return adminService.getEvent(no);
    }
    @PostMapping("/event/edit")
    public int eventDataUpdate(@RequestBody EventVO eventVO){
        System.out.println(eventVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        eventVO.setEvent_editer(userid);
        eventVO.setEvent_active_state(2);
        return adminService.updateEventData(eventVO);
    }
    @PostMapping("/eventActiveEdit")
    public int eventActiveEdit(@RequestParam Integer event_active_state, @RequestParam List<Integer> event_no) {
        System.out.println("Active State: " + event_active_state);
        System.out.println("event_no: " + event_no);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return adminService.updateEventActive(event_active_state, event_no, userid);
    }
}
