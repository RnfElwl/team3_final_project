package com.ict.backend.controller;

import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.service.ImageService;
import com.ict.backend.service.UserService;
import com.ict.backend.vo.MemberVO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;


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
    //@GetMapping("/images/{filename:.+}")
    //public ResponseEntity<Resource> getImage(@PathVariable String filename) {
//    @GetMapping("/imageworking")
//    public ResponseEntity<Resource> getImage() {
//        System.out.println("hi");
//        try {
//            int randomNum = (int) (Math.random() * 4) + 1;
//            String img = "login_" + randomNum + ".jpg"; // 랜덤 파일명 생성
//            Path filePath = Paths.get("D://team3_final_project/images/" + img);
//            Resource resource = new UrlResource(filePath.toUri());
//            if (resource.exists() || resource.isReadable()) {
//                return ResponseEntity.ok()
//                        .contentType(MediaType.IMAGE_JPEG) // 적절한 이미지 타입
//                        .body(resource);
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
    @GetMapping("/imageworking")
    public ResponseEntity<Resource> getImage() {
        System.out.println("hi");
            int randomNum = (int) (Math.random() * 4) + 1;
            String img = "login_" + randomNum + ".jpg"; // 랜덤 파일명 생성
            Path filePath = Paths.get("D://team3_final_project/images/" + img);
            String filePathStr =filePath.toString();
            ResponseEntity<Resource> responseEntity = imageService.getImage(filePathStr);
            System.out.println(responseEntity.getBody());
            return responseEntity;
    }

    @PostMapping("/upload")
    public ResponseEntity<Void> uploadImages(@RequestParam("images") MultipartFile[] files) {
        System.out.println("files : " + files);
        try {
            for (MultipartFile file : files) {
                String imgUrl = imageService.uploadImage(file, "profile"); // 각 이미지 저장 후 경로 반환
                //dbUploadService.upload(imgUrl, tableName); // DB에 경로 저장
                System.out.println("imgurl : "+ imgUrl);
                //String newImag = imageService.updateImage(file, "profile", "D:\\team3_final_project\\images\\profile\\poster2_1.png");
                //System.out.println("newImag : " + newImag);
            }
            return ResponseEntity.ok().build(); // 성공 응답, 본문 없이
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 오류 발생 시 응답
        }
    }


}
