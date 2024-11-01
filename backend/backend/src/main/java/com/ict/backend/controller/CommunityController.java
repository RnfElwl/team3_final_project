package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.service.ImageService;
import com.ict.backend.service.UserService;
import com.ict.backend.vo.CommunityLikeVO;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트를 명시
public class CommunityController {
    @Autowired
    CommunityService service;
    @Autowired
    ImageService imageService;

    //list
//    @GetMapping("/list")
//    public Page<CommunityVO> getCommunityList(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return service.getCommunityList(pageable);
//    }
    @GetMapping("/list")
    public List<CommunityVO> getCommunityList(@RequestHeader(value = "Host", required = false) String Host, String sortType, String categoryType){
            String userid= SecurityContextHolder.getContext().getAuthentication().getName();
        List<CommunityVO> vo = service.getCommunityList(userid, sortType, categoryType);
        for (CommunityVO community : vo) {
            if (community.getCommunity_img() != null) {
                community.setCommunity_img("http://" + Host +"/"+ community.getCommunity_img());
            }
        }
        return vo;
    }

    //게시글 작성
    @PostMapping("/create")
//    public CommunityVO createCommunity (@RequestBody CommunityVO vo){
    public CommunityVO createCommunity(
            @RequestParam("community_title") String title,
            @RequestParam("community_content") String content,
            @RequestParam(value = "community_img", required = false) MultipartFile[] image, // multipart 파일 수신
            @RequestParam("community_writedate") String writedate,
            @RequestParam("loc") String loc,
            @RequestParam("category") int category,
            @RequestParam("privacy") int privacy) {

        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(userid);
        String no = "";
        try {
            for (MultipartFile file : image) {
                String imgUrl = imageService.uploadImage(file, "community"); // image_tbl에 이미지 넣기
                System.out.println("New profile image uploaded: "+ imgUrl);         // 이미지 주소값 확인
                int num = service.uploadImage(imgUrl);
                System.out.println("no : "+ num);
                no = String.valueOf(num);// image_no값 확인
            }
        } catch (Exception e) {
            System.out.println(e); // 오류 발생 시 응답
        }

        CommunityVO community = new CommunityVO();
        community.setUserid(userid);
        community.setCommunity_title(title);
        community.setCommunity_content(content);
        community.setCommunity_img(no); // 이미지 저장 메서드 호출
        community.setCommunity_writedate(writedate);
        community.setLoc(loc);
        community.setCategory(category);
        community.setPrivacy(privacy);

        service.createCommunity(community);
        return community;
    }

    // 조회수 증가를 위한 별도의 API 엔드포인트
    @PutMapping("/hit/{community_no}")
    public void increaseHit(@PathVariable("community_no") int community_no) {
        service.increaseHit(community_no);
    }

    //view
    @GetMapping("/view/{community_no}")
    public CommunityVO getCommunityView(@PathVariable("community_no") int community_no, @RequestHeader(value = "Host", required = false) String Host){
        String userid= SecurityContextHolder.getContext().getAuthentication().getName();
        CommunityVO communityVO = service.getCommunityView(community_no, userid);
        System.out.println(communityVO.getCommunity_img());
        communityVO.setCommunity_img("http://" + Host +"/"+ communityVO.getCommunity_img());
        return communityVO;
    }

    @GetMapping("/top-viewed-posts")
    public List<CommunityVO> getTopViewedPosts() {
        return service.getTopViewedPosts(); // 서비스에서 해당 쿼리 호출
    }

    //edit
    @PutMapping("/edit/{community_no}")
//    public void editCommunity(@PathVariable int community_no, @RequestBody CommunityVO community){
        public CommunityVO editCommunity(
//        String edit_user = SecurityContextHolder.getContext().getAuthentication().getName();
//        community.setEdit_user(edit_user);
//        community.setCommunity_no(community_no);
//        service.editCommunity(community);
        @PathVariable int community_no,
        @RequestParam("community_title") String title,
        @RequestParam("community_content") String content,
        @RequestParam(value = "community_img", required = false) MultipartFile[] image, // multipart 파일 수신
        @RequestParam("community_writedate") String writedate,
        @RequestParam("loc") String loc,
        @RequestParam("category") int category,
        @RequestParam("privacy") int privacy) {

            String userid = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println(userid);
            String no = "";
            int result = 0;
            CommunityVO communityVO = service.getCommunityView(community_no, userid);
            String img_url = communityVO.getCommunity_img();
            System.out.println(communityVO);
            System.out.println(img_url);
            try {
                for (MultipartFile file : image) {
                    String imgUrl = imageService.updateImage(file, "community", img_url); // image_tbl에 이미지 넣기
                    System.out.println("New profile image uploaded: "+ imgUrl);         // 이미지 주소값 확인

                    result =  service.updateimageurl(imgUrl, service.getimgno(community_no));
                    //no = String.valueOf(num);// image_no값 확인
                }
            } catch (Exception e) {
                System.out.println(e); // 오류 발생 시 응답
            }

            CommunityVO community = new CommunityVO();
            community.setUserid(communityVO.getUserid());
            community.setCommunity_title(title);
            community.setCommunity_content(content);
            community.setCommunity_writedate(writedate);
            community.setLoc(loc);
            community.setCategory(category);
            community.setPrivacy(privacy);
            community.setEdit_user(userid);
            community.setCommunity_no(community_no);

            service.editCommunity(community);

            return community;
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
