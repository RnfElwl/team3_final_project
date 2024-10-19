package com.ict.backend.controller;

import com.ict.backend.service.ImageService;
import com.ict.backend.service.QnAService;
import com.ict.backend.service.UserService;
import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/qna")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class QnAController {
    @Autowired
    QnAService qnaService;
    @Autowired
    ImageService imgService;
    @Autowired
    UserService userService;

    @Value("${upload.dir:D:/uploads}") // 기본 경로 설정
    private String uploadDir;
    //글 목록 불러오기
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getQnAList(@ModelAttribute PagingVO pagingVO) {
        System.out.println("Input: " + pagingVO);
        System.out.println("Search Key: " + pagingVO.getSearchKey());  // Log check
        System.out.println("Search Word: " + pagingVO.getSearchWord());  // Log check

        List<QnAVO> result = qnaService.getQnAList(pagingVO);
        int qnaTotalPages = qnaService.getTotalRecord(pagingVO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("qnaList", result);
        resultMap.put("qnaTotalPages", qnaTotalPages);
        System.out.println("Result: " + resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    //뷰페이지 구하기
    @GetMapping("/view/{qna_no}")
    public ResponseEntity<List<QnAVO>> getQnAList(
            @PathVariable int qna_no,
            @RequestHeader(value = "Host", required = false) String Host) {


        List<QnAVO> qnaList = qnaService.getQnAView(qna_no);
        return new ResponseEntity<>(qnaList, HttpStatus.OK);
    }
    @PostMapping("/view/{qna_no}")
    public ResponseEntity<?> privateViewCheck(@RequestBody QnAVO passCheck){
        System.out.println("패스체크"+passCheck);
        int passCheckOk= qnaService.passWriteChk(passCheck);

        System.out.println("값이 맞니?"+passCheckOk);

        return new ResponseEntity<>(passCheckOk, HttpStatus.OK);
    }
    //이미지 불러오기
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
    //글 등록
    @PostMapping("/writeOk")
    public int QnaWriteOk(
            @RequestParam String qna_title,
            @RequestParam String qna_content,
            @RequestParam String head_title,
            @RequestParam int privacyQ,
            @RequestParam(required = false) String qna_pwd,
            @RequestParam int qna_state,
            @RequestParam int active_state,
            @RequestParam(value = "qna_img", required = false) MultipartFile[] qna_img
    ) {
        // 사용자 인증 확인
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        String no = "";
        int result=0;
        if (userid == null) {
            System.out.println("등록되지 않은 사용자입니다.");
            return 3;
        } else if (userid.equals("anonymousUser")) {
            System.out.println("등록된 사용자가 없습니다.");
            return 2;
        }  else {
            // uploads 폴더 경로 확인 및 생성
            try {
                for (MultipartFile file : qna_img) {

                    String imgUrl = imgService.uploadImage(file, "qna"); // image_tbl에 이미지 넣기
                    log.info("New profile image uploaded: {}", imgUrl);         // 이미지 주소값 확인
                    int num = userService.uploadImage(imgUrl);                  // 마지막에 들어간 image_no값을 리턴
                    log.info("no {}", num);                                      // image_no값 확인
                    no = String.valueOf(num);
                    //result = qnaService.updateprofile(no, qna_no);             // 똑바로 들어갔는지 확인 no = image_no/ userid = qna_no
                }
            } catch (Exception e) {
                System.out.println(e); // 오류 발생 시 응답
            }


            // QnAVO 객체 생성 및 속성 설정
            QnAVO qnaData = new QnAVO();
            qnaData.setUserid(userid);
            qnaData.setQna_title(qna_title);
            qnaData.setQna_content(qna_content);
            qnaData.setHead_title(head_title);
            qnaData.setPrivacyQ(privacyQ);
            qnaData.setQna_pwd(privacyQ == 1 ? qna_pwd : null);
            qnaData.setQna_state(qna_state);
            qnaData.setActive_state(active_state);

            // QnAVO에 이미지 경로 목록 설정
            qnaData.setQna_img(no);
            System.out.println(qnaData);
            // DB에 QnA 데이터 저장
            return qnaService.qnaInsert(qnaData);
        }
    }
    //수정할 데이터 불러오기
    @GetMapping("/viewEdit/{qna_no}")
    public ResponseEntity<List<QnAVO>> getQnAViewEdit(@PathVariable int qna_no) {
        List<QnAVO> result = qnaService.getQnAViewEdit(qna_no);
        System.out.println(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    //수정
    @PostMapping("/viewEditOk/{qna_no}")
    public void viewEdit(
            @PathVariable int qna_no,
            @RequestPart QnAVO editData,  // JSON 데이터 처리
            @RequestPart(value = "qna_img", required = false) MultipartFile[] qna_img) {

        // 프론트에서 받아온 정보 확인
        System.out.println("수정된 데이터: " + editData);
        System.out.println("업로드된 파일: " + Arrays.toString(qna_img));

        // qna_no 번호를 토대로 기존의 qna_img 경로 가져오기
        Integer qnaPath = qnaService.qnaImgNumGet(qna_no);
        System.out.println("qna이미지경로:"+qnaPath);

        try {
            if (qna_img != null && qna_img.length > 0) {
                // 이미지 파일이 있을 경우 처리
                for (MultipartFile file : qna_img) {
                    if (file != null && !file.isEmpty()) {
                        if (qnaPath != null) {
                            // 기존 이미지가 있을 경우 업데이트
                            String updatedImgUrl = imgService.updateImage(file, "qna", String.valueOf(qnaPath));
                            System.out.println("이미지 업데이트 경로: " + updatedImgUrl);
                            qnaService.updateImgUrl(updatedImgUrl, qnaPath);
                            editData.setQna_img(String.valueOf(qnaPath)); // 기존 경로 유지
                        } else {
                            // 기존 이미지가 없을 경우 새로 업로드
                            String newImgUrl = imgService.uploadImage(file, "qna");
                            System.out.println("새로운 이미지 경로: " + newImgUrl);
                            Integer qna_i_no = qnaService.insertImgUrl(newImgUrl);
                            editData.setQna_img(String.valueOf(qna_i_no)); // 새로운 경로 설정
                        }
                    }
                }
            }

            // 수정된 데이터 처리
            System.out.println("수정 데이터 처리 중: " + editData);
            String userid = SecurityContextHolder.getContext().getAuthentication().getName(); // 현재 로그인한 유저 ID 가져오기
            editData.setUserid(userid); // 유저 ID 설정
            editData.setQna_no(qna_no); // QnA 번호 설정
            System.out.println("수정 후 데이터: " + editData);

            // 데이터베이스 업데이트
            qnaService.qnaUpdate(editData);

        } catch (Exception e) {
            // 오류 발생 시 처리
            log.error("수정 중 오류 발생", e); // 로그에 오류 기록
            e.printStackTrace(); // 콘솔에 오류 출력
        }
    }
    @GetMapping("/viewDel/{qna_no}")
    public void qnaViewDel(@PathVariable int qna_no){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();

        //문의글 삭제
        qnaService.qnaDel(qna_no,userid);
        System.out.println("번호:"+qna_no+",유저아이디"+userid);
    }





}
