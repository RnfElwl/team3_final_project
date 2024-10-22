package com.ict.backend.controller;

import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.jwt.JWTUtil;
import com.ict.backend.service.*;
import com.ict.backend.vo.MemberVO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;


@Slf4j
@RestController
@RequestMapping("/user")
//@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.*:3000"})
//@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    ImageService imageService;
    @Autowired
    FilterService filterService;
    @Autowired
    CommunityService communityService;
    @Autowired
    CommentService commentService;
    @Autowired
    CommentReplyService commentReplyService;
    @Autowired
    QnAService qnAService;
    @Autowired
    ReviewService reviewService;
    @Autowired
    EmailService emailService;
    @Autowired
    JWTUtil jwtUtil;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/view")
    public String view() {
        log.info("userService -> {}", userService);

        log.info("정보 들어옴");
        log.info("{}", userService.test());
        return "hi";
    }
    @GetMapping("/userinfo")
    public String getUserInfo() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if(userid.equals("anonymousUser")){
            System.out.println("등록된 사용자가 없습니다.");
            return null;
        } else{
            System.out.println(userid);
            return userid;
        }
    }
    @GetMapping("/test")
    public String test() {
        return "test";
    }
    @PostMapping("/te")
    public String login() {
        System.out.println("hi");
        //System.out.println("test"+ vo);
        return null;
    }

    @GetMapping("/imageworking")
    public ResponseEntity<Resource> getImage() {
        System.out.println("hi");
            int randomNum = (int) (Math.random() * 4) + 1;
            String img = "login_" + randomNum + ".jpg"; // 랜덤 파일명 생성
            Path filePath = Paths.get("images/" + img);
            //Path filePath = Paths.get("D://team3_final_project/images/" + img);
            String filePathStr =filePath.toString();
            ResponseEntity<Resource> responseEntity = imageService.getImage(filePathStr);
            log.info("Response Status: {}", responseEntity.getStatusCode());
            log.info("Response Headers: {}", responseEntity.getHeaders());
            log.info("Response Body: {}", responseEntity.getBody() != null ? responseEntity.getBody().toString() : "No body");
            System.out.println(responseEntity.getBody());
            return responseEntity;
    }
    @GetMapping("loadprofile")
    public ResponseEntity<Resource> getprofile() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        //log.info("userid1 = > {}", userid);
        String filePath = userService.userprofile(userid);
        //log.info("filepath -> {}", filePath);
        if (filePath == null) {
            filePath = "images/default/profile.png";    // 프로필 없을시 default 프로필
        }
        ResponseEntity<Resource> responseEntity = imageService.getImage(filePath);
        return responseEntity;
    }
    // 사용자 정보 수신
    @GetMapping("/info")
    public MemberVO userinfo() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("userid2 = > {}", userid);
        // 사용자 정보를 가져오는 서비스 메서드 호출
        MemberVO userInfo = userService.getUserInfo(userid);
        log.info(userInfo.toString());
        return userInfo;
    }
    @GetMapping("/totaldata")
    public ResponseEntity<Map<String, Object>> getUserData(@RequestHeader(value = "Host", required = false) String Host) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        // 각 서비스에서 데이터 가져오기
        List<Map<String, String>> bookmarks = userService.getBookmarks(userid, 10);
        List<Map<String, String>> history = userService.getHistory(userid, 10);

        // 결과를 하나의 맵에 담기
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("bookmarks", bookmarks);
        responseData.put("history", history);
        responseData.put("bookmark_n", userService.getCountBookmarks(userid));
        responseData.put("follower", userService.getCountfollower(userid)); // 내가 팔로우 한 수
        responseData.put("following", userService.getCountfollowing(userid));   // 내가 팔로잉 한 수
        responseData.put("community", userService.getCountCommunity(userid));
        responseData.put("comment", userService.getCountComment(userid) + userService.getCountReplyComment(userid));
        responseData.put("communitylist", userService.getCommunityList(userid, "desc", 3));
        responseData.put("commentlist", userService.getCommentList(userid, "desc", 3));
        responseData.put("qnalist", userService.getQnAList(userid, "desc", 3));
        responseData.put("likecommunitylist", userService.getLikeCommunityList(userid, "desc", 3));

        System.out.println(responseData);
        return ResponseEntity.ok(responseData);
    }
    @GetMapping("/del/{type}")
    public ResponseEntity<String> delinfo(@PathVariable String type,
                                          @RequestParam(value = "no") int no,
                                          @RequestParam(value = "subtype", required = false )String subtype) {
        System.out.println(type + ", " + no+ ", " + subtype);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!userid.equals("anonymousUser")){
            try {
                if (type.equals("qna")) {
                    qnAService.qnaDel(no, userid);
                } else if (type.equals("community")) {
                    if(subtype.equals("comment")){
                        commentService.deleteComment(no);
                    }else if(subtype.equals("reply")){
                        commentReplyService.deleteReply(no);
                    }else {
                        communityService.deleteCommunity(no);
                    }
                } else if (type.equals("review")) {
                    reviewService.deleteReview(no, userid);
                }
                else {
                    commentService.deleteComment(no);
                }
                return ResponseEntity.ok("Delete successful");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed: " + e.getMessage());
            }
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Need login");
        }
    }

    // 북마크한 정보 가져오기
    @GetMapping("/bookmarks")
    public ResponseEntity<List<Map<String, String>>> getBookmarks() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Map<String, String>> bookmarks = userService.getBookmarks(userid, 0);
        System.out.println(bookmarks);
        return ResponseEntity.ok(bookmarks);
    }
    // 최근 본 list 가져오기
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, String>>> getHistory() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Map<String, String>> history = userService.getHistory(userid, 0);
        System.out.println(history);
        return ResponseEntity.ok(history);
    }
    // 팔로워 불러오기
    @GetMapping("/follower")
    public ResponseEntity<List<Map<String, String>>> getFollower(@RequestHeader(value = "Host", required = false) String Host) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Map<String, String>> follower = userService.getfollower(userid, 0);
        System.out.println(follower);
        for (Map<String, String> user : follower) {
            String imageUrl = user.get("image_url");
            if (imageUrl != null) {
                user.put("image_url", "http://" + Host + "/" + imageUrl);
            }
        }
        return ResponseEntity.ok(follower);
    }


@GetMapping("/mypageinfo")
public MemberVO mypageinfo(@RequestHeader(value = "Host", required = false) String Host) {
    String userid = SecurityContextHolder.getContext().getAuthentication().getName();
    log.info("테스트용 user정보 : {}", userid);
    MemberVO userInfo = userService.getUserInfo(userid);
    String filePath = userService.userprofile(userid);

    if (filePath == null) {
        filePath = "images/default/profile.png"; // 프로필 없을시 default 프로필
    }
    System.out.println("host = "+ Host);
    //referer = referer.replace(":3000/", ":9988");
    // 이미지를 HTTP URL로 변환
    String imageUrl = "http://" + Host + "/" + filePath;    // 나중에 시연시 써야할거
    //String imageUrl = "http://192.168.1.88:9988/user/" + filePath;    // 나중에 시연시 써야할거
    //String imageUrl = "http://localhost:9988/user/" + filePath; // 적절한 경로로 수정
    userInfo.setUserprofile(imageUrl); // HTTP URL 설정

    System.out.println(userInfo);
    return userInfo;
}
    // 이미지 불러오기용
    @GetMapping("/images/{foldername}/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String foldername, @PathVariable String filename) {
        System.out.println("여기 들어옴"  +foldername+ "/" + filename);

        String currentDir = System.getProperty("user.dir");
        Path imagePath = Paths.get(currentDir+ "/images/" + foldername+ "/" + filename);
        System.out.println("imagepath = " + imagePath);
        //Path imagePath = Paths.get("D:/team3_final_project/images/" + foldername+ "/" + filename);
        try {
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(imagePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("잘못된 URL: {}", e.getMessage());
            return ResponseEntity.badRequest().build(); // 잘못된 요청
        } catch (Exception e) {
            log.error("서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 오류
        }
    }
    // 사용자 정보 업데이트
    @PostMapping("/update")
    public int updateUserInfo(@RequestBody MemberVO memberVO) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if(userid.equals(memberVO.getUserid())){
            return userService.updateUserInfo(memberVO);
        }
        else{
            return 0;
        }
    }
    public String changePassword(@RequestBody Map<String, String> requestBody) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentPassword = requestBody.get("currentPassword");
        String newPassword = requestBody.get("newPassword");

        if (!userid.equals(requestBody.get("userid"))) {
            return "User ID mismatch.";
        }

        String userpwd = userService.getuserpwd(userid);
        if (bCryptPasswordEncoder.matches(currentPassword, userpwd)) {
            String encryptedNewPassword = bCryptPasswordEncoder.encode(newPassword);
            userService.changepassword(userid, encryptedNewPassword);
            return "Password changed successfully.";
        } else {
            return "Current password is incorrect.";
        }
    }
    // 사용자 프로필사진 업데이트
    @PostMapping("/uploadProfile")
    public ResponseEntity<Void> uploadProfile(@RequestParam("images") MultipartFile[] files) {
        System.out.println(files);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        int profileurl = userService.userprofileno(userid);
        log.info("Current profile URL: {}", profileurl);
        int result = 0;
        try {
            for (MultipartFile file : files) {
                String imgUrl;
                if (profileurl == 1) {
                    imgUrl = imageService.uploadImage(file, "profile");
                    log.info("New profile image uploaded: {}", imgUrl);
                    int no = userService.uploadImage(imgUrl); //이거
                    log.info("no {}", no);
                    result = userService.updateprofile(no, userid);
                } else {
                    userService.userprofileno(userid);
                    imgUrl = imageService.updateImage(file, "profile", userService.userprofile(userid));
                    log.info("Profile image updated: {}", imgUrl);
                    int profileno = userService.userprofileno(userid);
                    System.out.println("profileno = " + profileno);
                    result = userService.updateimageurl(imgUrl, profileno);
                }
                if (result == 0) {
                    log.error("Profile update failed for userid: {}", userid);
                    return ResponseEntity.status(500).body(null);
                }
            }
            return ResponseEntity.ok().build(); // 성공 응답, 본문 없이
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 오류 발생 시 응답
        }
    }

    // 새로운 사진 업로드
    @PostMapping("/upload")
    public ResponseEntity<Void> uploadImages(@RequestParam("images") MultipartFile[] files) {
        System.out.println("files : " + files);
        try {
            for (MultipartFile file : files) {
                String imgUrl = imageService.uploadImage(file, "profile"); // 각 이미지 저장 후 경로 반환
                //dbUploadService.upload(imgUrl, tableName); // DB에 경로 저장
                System.out.println("imgurl : "+ imgUrl);
                String newImag = imageService.updateImage(file, "profile", "images/profile/poster5_3.png");
                System.out.println("newImag : " + newImag);
            }
            return ResponseEntity.ok().build(); // 성공 응답, 본문 없이
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 오류 발생 시 응답
        }
    }
    @GetMapping("/info/{usernick}")
    public ResponseEntity<Map<String, Object>> otheruser(@PathVariable String usernick,
                                                         @RequestHeader(value = "Host", required = false) String Host) {
        if (usernick == null || usernick.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Usernick is required"));
        }
        System.out.println(usernick);
        MemberVO vo =  userService.getOtherUserInfo(usernick);
        if (vo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        String userid = vo.getUserid();
        List<Map<String, String>> bookmarks = userService.getBookmarks(userid, 10);
//        List<Map<String, String>> followers = userService.getfollower(userid, 14);

        String userprofile = "http://" + Host +"/" + vo.getUserprofile();

        Map<String, Object> userdata = new HashMap<>();
        userdata.put("userid", userid);
        userdata.put("usernick", vo.getUsernick());
        userdata.put("userprofile", userprofile);
        userdata.put("bookmarks", userService.getCountBookmarks(userid));
        userdata.put("follower", userService.getCountfollower(userid)); // 내가 팔로우 한 수
        userdata.put("following", userService.getCountfollowing(userid));   // 내가 팔로잉 한 수
        userdata.put("community", userService.getCountCommunity(userid));
        userdata.put("comment", userService.getCountComment(userid) + userService.getCountReplyComment(userid));
        int com = userService.getCountComment(userid);
        int rel = userService.getCountReplyComment(userid);
        int total = com + rel;
        System.out.println("total : " + total + " com : " + com + " rel : " + rel);

//        for (Map<String, String> user : followers) {
//            String imageUrl = user.get("image_url");
//            if (imageUrl != null) {
//                user.put("image_url", "http://" + Host +"/"+ imageUrl);
//                System.out.println(user.toString());
//            }
//        }
        // 결과를 하나의 맵에 담기
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", userdata);
        responseData.put("bookmarks", bookmarks);
//        responseData.put("followers", followers);
        System.out.println(responseData);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/info/f/{endpoint}")
    public ResponseEntity<List<Map<String, String>>> getFollowers(@RequestParam("usernick") String usernick, @PathVariable("endpoint") String endpoint, @RequestHeader(value = "Host", required = false) String Host) {
        String login_user = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(usernick);
        System.out.println(endpoint);

        MemberVO vo =  userService.getOtherUserInfo(usernick);
        if (vo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonList(Map.of("error", "User not found")));
        }
        String userid = vo.getUserid();
        List<Map<String, Object>> followerData  = userService.getFollowData(login_user, userid, endpoint);
        System.out.println(followerData);

        List<Map<String, String>> responseList = new ArrayList<>();
        for (Map<String, Object> user : followerData) {
            Map<String, String> responseMap = new HashMap<>();

            //responseMap.put("follow_user", (String) user.get("follow_user")); // follower_userid
            responseMap.put("follow_user_nick", (String) user.get("usernick")); // usernick
            responseMap.put("is_follower", String.valueOf(user.get("is_follow"))); // is_follower
            responseMap.put("follow_user_image", user.get("image_url") != null
                        ? "http://" + Host + "/" + user.get("image_url")
                        : null);

            responseList.add(responseMap);
        }
        System.out.println("followers : " + responseList);
        return ResponseEntity.ok(responseList);
    }
    @PostMapping("/info/toggleFollow")
    public ResponseEntity<String> toggleFollow(@RequestBody Map<String, String> request) {
        String follow_user_nick = request.get("follow_user_nick");  // 눌린 사람의 닉네임
        System.out.println("follow_user_nick : " + follow_user_nick);
        String login_user = SecurityContextHolder.getContext().getAuthentication().getName();   // 로그인한 사용자
        MemberVO vo =  userService.getOtherUserInfo(follow_user_nick);  //눌린 사람의 닉네임으로 그 사람의 아이디 찾기
        String follower_user_id = vo.getUserid();
        if (!login_user.equals("anonymousUser")) {
            try {
                boolean isUpdated = userService.toggleFollow(follower_user_id, login_user);
                if (isUpdated) {
                    return ResponseEntity.ok("Follow status updated successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update follow status");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating follow status");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Need login");
        }
    }
    @GetMapping("/myposts/{tab}")
    public ResponseEntity<Map<String, Object>> getMyPosts(@PathVariable String tab,
                                                          @RequestParam("column") String column,
                                                          @RequestParam("order") String order,
                                                          @RequestParam(value = "searchType", required = false) String searchType,
                                                          @RequestParam(value = "searchKeyword", required = false) String searchKeyword,
                                                          @RequestParam(value = "offset", required = false) int offset) {
        System.out.println("request : " + tab + " " + column + " " + order + " " + searchType + " " + searchKeyword + " " + offset);
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(userid);

        if (!userid.equals("anonymousUser")) {
            try {
                int postcnt = 0;
                List<Map<String, Object>> postData;
                System.out.println("tab : " + tab);
//                postcnt = filterService.TotalFilterCount(tab, column, userid, searchType, searchKeyword);
//                postData = filterService.TotalFilter(tab, column, userid, order, searchType, searchKeyword, offset);
                if("community".equals(tab)){
                    System.out.println("column : " + column);
                    if("like".equals(column)){
                        postcnt = filterService.CommunityLikeFilterCount(column, userid, searchType, searchKeyword);
                        postData = filterService.CommunityLikeFilter(column, userid, order, searchType, searchKeyword, offset);
                    }else{
                        postcnt = filterService.CommunityFilterCount(column, userid, searchType, searchKeyword);
                        postData = filterService.CommunityFilter(column, userid, order, searchType, searchKeyword, offset);
                    }
                } else if("review".equals(tab)){
                    postcnt = filterService.MovieFilterCount(column, userid, searchType, searchKeyword);
                    postData = filterService.MovieFilter(column, userid, order, searchType, searchKeyword, offset);
                }else{
                    postcnt = filterService.QnAFilterCount(column, userid, searchType, searchKeyword);
                    postData = filterService.QnAFilter(column, userid, order, searchType, searchKeyword, offset);
                }

                System.out.println(postData);

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("posts", postcnt);
                responseData.put("postdata", postData);
                System.out.println(responseData);

                // 반환하도록 수정
                return ResponseEntity.ok(responseData);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Error updating follow status"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "Need login"));
        }
    }
    @PostMapping("/find")
    public ResponseEntity<Map<String, String>> findUser(@RequestBody Map<String, String> request, @RequestHeader(value = "Host", required = false) String Host) {
        String type = request.get("type");
        String username = request.get("username");
        String useremail = request.get("useremail");
        String userid = request.get("userid");
        Map<String, String> response = new HashMap<>();

        // "id" 찾기 로직
        if ("id".equals(type)) {
            String foundUserid = userService.findidByNameAndEmail(username, useremail);
            if (foundUserid != null) {
                response.put("userid", foundUserid);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "아이디를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        // "password" 찾기 로직 (비밀번호 재설정 링크 전송 등)
        if ("password".equals(type)) {
            boolean result = userService.findpwdByNameAndEmailAndId(userid, username, useremail);
            if (result) {
                try {
                    String resetToken = jwtUtil.createJwt(userid, "ROLE_USER", 30 * 60 * 1000L);  // 30분 유효
                    //String resetToken = jwtUtil.createJwt(userid, "ROLE_USER", 30 * 1000L);
                    String updatedHost = Host.replace(":9988", ":3000");
                    String resetLink = "Http://" + updatedHost + "/reset-password?token="  + resetToken;
                    System.out.println(resetLink);
                    String testemail = "kimbj829@naver.com";
                    emailService.sendPasswordResetEmail(testemail, resetLink);  // 이메일 전송
                    response.put("message", "비밀번호 재설정 링크가 전송되었습니다.");
                    return ResponseEntity.ok(response);
                } catch (MessagingException e) {
                    response.put("message", "이메일 전송 중 오류가 발생했습니다.");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            } else {
                response.put("message", "비밀번호 재설정 요청이 실패했습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        response.put("message", "유효하지 않은 요청입니다.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestData) {
        String token = requestData.get("token");
        String newPassword = requestData.get("newPassword");
        String encryptedNewPassword = "";
        try {
            // 1. 토큰 만료 여부 확인
            boolean isExpired = jwtUtil.isExpired(token);
            if (!isExpired) {
                encryptedNewPassword = bCryptPasswordEncoder.encode(newPassword);
            }
            System.out.println("암화화 비번 : "+ encryptedNewPassword);
            // 2. 토큰에서 사용자 ID 추출
            String userid = jwtUtil.getUserid(token);
            System.out.println("userid: " + userid);

            // 3. 비밀번호 재설정 로직 호출
            int isReset = userService.changepassword(userid, encryptedNewPassword);  // userid를 사용하여 비밀번호 재설정

            // 4. 결과 반환
            if (isReset > 0) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 재설정 실패");
            }

        } catch (ExpiredJwtException e) {
            // 만료된 토큰 예외 처리
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("JWT가 만료되었습니다.");
        } catch (JwtException e) {
            // 잘못된 토큰 예외 처리
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 토큰입니다.");
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 재설정 중 오류가 발생했습니다.");
        }
    }





}
