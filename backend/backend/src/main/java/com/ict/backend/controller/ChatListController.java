package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.service.JoinService;
import com.ict.backend.util.UUIDUtils;
import com.ict.backend.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Slf4j
    @RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins = "http://localhost:3000")
public class ChatListController {
    private ChatListService chatListService;
    @Autowired
    public ChatListController(ChatListService chatListService){
        this.chatListService = chatListService;
    }

    @PostMapping("/add")
    public int insertChatMessage(@RequestBody ChatVO chatVO){
        System.out.println(chatVO.toString());
        return chatListService.insertChatMessage(chatVO);
    }
    @PostMapping("/create")
    public String insertChatList(@RequestBody ChatListVO chatListVo){
        String chatlist_url = UUIDUtils.createType4UUID();
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        chatListVo.setChatlist_url(chatlist_url);

        chatListVo.setUserid(userid);
        if(chatListVo.getChatlist_type() == 1){
            chatListVo.setChatlist_headcount(1);
            chatListService.insertChatList(chatListVo);
            chatListService.insertChatEnter(chatlist_url, userid);
        }
        else if (chatListVo.getChatlist_type() == 2){
            chatListVo.setChatlist_headcount(2);
            String userid2 = chatListVo.getUser2();
            ChatListVO clVO =  chatListService.selectSoloChatRoomCheck(userid, userid2);
            if(clVO!=null){
                return clVO.getChatlist_url();
            }
            chatListService.insertChatList(chatListVo);
            ChatUserVO chatuserVO = chatListService.selectChatUser(chatlist_url, userid);
            if(chatuserVO==null){
                chatListService.insertChatEnter(chatlist_url, userid);
                chatListService.insertChatEnter(chatlist_url, chatListVo.getUser2());
            }

        }
        return chatlist_url;
    }
    @GetMapping("/openChatList")
    public List<ChatListVO> selectOpenChatList(@RequestParam String keyWord){
        System.out.println(keyWord);
        List<ChatListVO> list = chatListService.selectOpenChatList(keyWord);
        return  list;
    }
    @GetMapping("/{chatlist_url}")
    public List<ChatVO> selectChatContent(@PathVariable String chatlist_url){
        System.out.println("-----------------");
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ChatVO> list = chatListService.selectChatContent(chatlist_url, userid);

        return list;
    }
    @PostMapping("/userlistadd/{chatlist_url}")
    public int insertChatUserList(@PathVariable String chatlist_url){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        ChatUserVO chatuserVO = chatListService.selectChatUser(chatlist_url, userid);
        System.out.println(chatuserVO==null);
        if(chatuserVO==null || chatuserVO.getFlag()==0){
            System.out.println(chatuserVO);
            int result = chatListService.insertChatEnter(chatlist_url, userid);
            return result;
        }
        return 0;
    }
    @GetMapping("/roominfo")
    public ChatListVO selectRoomInfo(@RequestParam String chatlist_url){
        return chatListService.selectChatRoom(chatlist_url);
    }
    @GetMapping("/member-list")
    public List<ChatVO> selectChatMember(@RequestParam String chatlist_url){
        return chatListService.selectChatMember(chatlist_url);
    }
    @PostMapping("/headcount")
    public int updateChatHeadCount(@RequestBody String chatlist_url){
        System.out.println(chatlist_url);
        return chatListService.updateChatHeadCount(chatlist_url);
    }
    @PostMapping("/schedule/create")
    public int insertSchedule(@RequestBody ScheduleVO scheduleVO){
        String chatlist_url = UUIDUtils.createType4UUID();
        scheduleVO.setSchedule_id(chatlist_url);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        scheduleVO.setUserid(userid);
        String schedule_date = scheduleVO.getDay()+" "+scheduleVO.getTime();
        scheduleVO.setSchedule_date(schedule_date);
        scheduleVO.setSchedule_deadline(schedule_date);
        System.out.println(scheduleVO.toString());

        return chatListService.insertSchedule(scheduleVO);
    }
    @GetMapping("/schedule/list")
    public List<ScheduleVO> selectScheduleList(@RequestParam String chatlist_url){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(chatlist_url +""+userid);
        return chatListService.selectScheduleList(chatlist_url, userid);
    }
    @PostMapping("/schedule/voting")
    public int insertSchduleVoting(@RequestBody VotingVO votingVO){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        votingVO.setUserid(userid);
        System.out.println(votingVO.toString());
        return chatListService.insertScheduleVoting(votingVO);
    }
    @GetMapping("/vote/list")
    public List<MemberVO> selectVoteList(VotingVO votingVO){
        System.out.println(votingVO.toString());
        return chatListService.selectVoteList(votingVO);
    }
    @PostMapping("/exit")
    public int updateChatUserFlag(@RequestBody String chatlist_url){

        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        Date now = new Date();

        // 날짜 형식 정의
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        // Date 객체를 문자열로 변환
        String last_conn = formatter.format(now);
        int result = chatListService.updateChatUserExit(chatlist_url, userid, last_conn);
        if(result>=1){
            chatListService.updateChatHeadCountExit(chatlist_url);
        }
        return result;
    }
    @PostMapping("/exit/solo")
    public int updateSoloChatUserConn(@RequestBody String chatlist_url){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        Date now = new Date();
        // 날짜 형식 정의
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // Date 객체를 문자열로 변환
        String last_conn = formatter.format(now);
        int result = chatListService.updateSoloChatUserConn(chatlist_url, userid, last_conn);
        return result;
    }
    @GetMapping("/soloChatList")
    public List<ChatListVO> selectSoloChatList(@RequestParam String keyWord){
        String userid =SecurityContextHolder.getContext().getAuthentication().getName();
        return chatListService.selectSoloChatList(userid, keyWord);
    }
    @GetMapping("/check/solo")
    public int selectSoloChatCheck(@RequestParam String chatlist_url){
        System.out.println(chatlist_url);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        ChatUserVO chatuserVO = chatListService.selectChatUser(chatlist_url, userid);
        if(chatuserVO.getLast_conn() != null){
            Date now = new Date();
            // 날짜 형식 정의
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            // Date 객체를 문자열로 변환
            String first_conn = formatter.format(now);
            chatListService.updateSoloChatUserConn(chatlist_url, userid, null);
            chatListService.updateSoloChatUserFirstConn(chatlist_url, userid, first_conn);
        }
        return chatListService.selectSoloChatCheck(chatlist_url, userid);
    }
}
