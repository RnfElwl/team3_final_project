package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트를 명시
public class CommunityController {
    @Autowired
    CommunityService service;

    //list
//    @GetMapping("/list")
//    public Page<CommunityVO> getCommunityList(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return service.getCommunityList(pageable);
//    }
    @GetMapping("/list")
    public List<CommunityVO> getCommunityList(){
        String userid= SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getCommunityList(userid);
    }

    //게시글 작성
    @PostMapping("/create")
    public CommunityVO communityInsert (@RequestBody CommunityVO vo){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        vo.setUserid(userid);
        System.out.println(vo.toString());
        service.createCommunity(vo);
        return vo;
    }

    // 조회수 증가를 위한 별도의 API 엔드포인트
    @PutMapping("/hit/{community_no}")
    public void increaseHit(@PathVariable("community_no") int community_no) {
        service.increaseHit(community_no);
    }

    //view
    @GetMapping("/view/{community_no}")
    public CommunityVO getCommunityView(@PathVariable("community_no") int community_no){
        CommunityVO communityVO = service.getCommunityView(community_no);
        return communityVO;
    }

    @GetMapping("/top-viewed-posts")
    public List<CommunityVO> getTopViewedPosts() {
        return service.getTopViewedPosts(); // 서비스에서 해당 쿼리 호출
    }

    //edit
    @PutMapping("/edit/{community_no}")
    public void editCommunity(@PathVariable int community_no, @RequestBody CommunityVO community){
        String edit_user = SecurityContextHolder.getContext().getAuthentication().getName();
        community.setEdit_user(edit_user);
        community.setCommunity_no(community_no);
        service.editCommunity(community);
    }

    //delete
    @DeleteMapping("/{community_no}")
    public void deleteCommunity(@PathVariable int community_no) {
        // 댓글 삭제
        service.deleteCommentsByCommunityNo(community_no); // 댓글 먼저 삭제
        service.deleteCommunity(community_no);
    }

    // 좋아요 상태 확인
    @GetMapping("/like/status")
    public boolean isLiked(@RequestParam int community_no) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName(); // 현재 로그인한 사용자 ID 가져오기
        CommunityLikeVO like = new CommunityLikeVO(community_no, userid); // 두 개의 인자를 사용하여 객체 생성
        if(service.isLiked(like)>0){
            service.unlikeCommunity(like);
            return false;
        }
        else{
            service.likeCommunity(like);
            return true;
        }
        //return service.isLiked(like) > 0; // 좋아요가 존재하면 true 반환
    }

    // 좋아요 개수 조회
    @GetMapping("/likes/count/{community_no}")
    public int getLikesCount(@PathVariable int community_no) {
        return service.getLikesCount(community_no);
    }


}
//-------------------------------------좋아요 필요없어짐--------------------------------------------------------------------
    //like 추가
//    @PostMapping("/like")
//    public void likeCommunity(@RequestBody CommunityLikeVO like){
//        String userid = SecurityContextHolder.getContext().getAuthentication().getName(); // 현재 로그인한 사용자 ID 가져오기
//        like.setUserid(userid);
//        service.likeCommunity(like);
//    }
//
//    // 좋아요 삭제
//    @DeleteMapping("/unlike")
//    public void unlikeCommunity(@RequestBody CommunityLikeVO like) {
//        System.out.println("1" + like.toString());
//        String userid = SecurityContextHolder.getContext().getAuthentication().getName(); // 현재 로그인한 사용자 ID 가져오기
//        like.setUserid(userid);
//        System.out.println("2" + like.toString());
//        service.unlikeCommunity(like);
//    }
