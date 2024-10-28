package com.ict.backend.controller;

import com.ict.backend.jwt.JWTUtil;
import com.ict.backend.service.JoinService;
import com.ict.backend.vo.MemberVO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    JoinService joinService;
    @Autowired
    JWTUtil jwtUtil;

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        // 카카오 API 호출
        String userInfo = getKakaoUserInfo(token);
        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("카카오 로그인 실패");
        }
        try {
            // userInfo에서 ID 추출
            JSONObject jsonObject = new JSONObject(userInfo);
            String kakaoUserId = jsonObject.get("id").toString();

            // JoinService에서 해당 아이디가 있는지 확인
            System.out.println(kakaoUserId);
            MemberVO vo = joinService.findByUserid(kakaoUserId);
            System.out.println("vo = " + vo);

            JSONObject response = new JSONObject();
            if (vo != null) {
                String jwtToken = jwtUtil.createJwt(vo.getUserid(), vo.getRole(), 1000 * 60 * 30L);
                String refreshToken = jwtUtil.createJwt(vo.getUserid(), vo.getRole(), 1000 * 60 * 60 * 24L); // 1일 유효기간
                System.out.println("1 :"+ vo.getUserid());
                response.put("status", "existing_user");
                response.put("message", "이미 가입된 사용자입니다.");
                response.put("token", jwtToken);
                response.put("refreshToken", refreshToken);
                return ResponseEntity.ok(response.toString());
//                return ResponseEntity.ok("이미 가입된 사용자입니다.");
            } else {
                System.out.println("2 : ");
                response.put("status", "new_user");
                response.put("message", "신규 사용자입니다.");
                response.put("link", "/kakaosignup");
                response.put("userid", kakaoUserId);
                return ResponseEntity.ok(response.toString());
//                return ResponseEntity.ok(userInfo);
//                return ResponseEntity.ok("신규 사용자입니다.");
            }

        } catch (JSONException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("JSON 파싱 오류 발생");
        }

        // userInfo를 바탕으로 회원 가입 또는 로그인 처리
        // 예시로는 userInfo를 리턴하고, 실제 서비스에서는 사용자 DB와 비교하거나 저장하는 작업이 필요

//        return ResponseEntity.ok(userInfo);
    }

    private String getKakaoUserInfo(String token) {
        String reqUrl = "https://kapi.kakao.com/v2/user/me";
        try {
            URL url = new URL(reqUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer " + token);

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) { // 성공적으로 카카오로부터 응답을 받음
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();
                return sb.toString(); // JSON 형태로 반환된 사용자 정보
            } else {
                return null; // 실패
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
