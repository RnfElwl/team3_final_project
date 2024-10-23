package com.ict.backend.jwt;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.service.RefreshService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.*;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final Long accessExpiredMs;
    private final Long refreshExpiredMs;

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private RefreshService refreshService;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshService refreshService) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshService = refreshService;
        refreshExpiredMs = 86400000L;   // 1일로 설정
        accessExpiredMs = 600000L;   // 10분으로 설정
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            Enumeration<String> result = request.getParameterNames();
//            System.out.println("userid = "+request.getParameter("userid"));
//            System.out.println("ttt");
            while(result.hasMoreElements()){
                String key = result.nextElement();
                String value = request.getParameter(key);
//                System.out.println("1"+key);
//                System.out.println("2"+value);
            }

            String userid = request.getParameter("userid");
            String password = request.getParameter("userpwd");
            // String username = obtainUsername(request);
            // String password = obtainPassword(request);
            System.out.println(userid);
            //System.out.println(username);

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userid, password, null);
            //UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

            return authenticationManager.authenticate(authToken);
        } catch (AuthenticationException e) {
            // 요청 본문을 읽는 과정에서 오류가 발생한 경우, AuthenticationServiceException을 던집니다.
            throw new AuthenticationServiceException("인증 처리 중 오류가 발생했습니다.", e);
        }

    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication)  throws IOException {
        System.out.println("successful authentication");
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(username, role, accessExpiredMs);
        String refreshtoken = jwtUtil.createJwt(username, role,refreshExpiredMs);
        if(refreshService.checkRefresh(username)> 0){
            refreshService.updateRefresh(username, refreshtoken, refreshExpiredMs/86400000);
        }
        else {
            refreshService.saveRefresh(username, refreshtoken, refreshExpiredMs / 86400000);
        }
        System.out.println("token = "+ token);
        response.addHeader("Authorization", "Bearer " + token);
        // 클라이언트가 Authorization 헤더를 읽을 수 있도록, 해당 헤더를 노출시킵니다.
        response.setHeader("Access-Control-Expose-Headers", "Authorization");

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("userid", username);
        responseBody.put("refresh",refreshtoken);

        // ObjectMapper를 사용하여 Map을 JSON 문자열로 변환합니다.
        String responseBodyJson = new ObjectMapper().writeValueAsString(responseBody);

        // 응답 컨텐츠 타입을 설정합니다.
        response.setContentType("application/json");

        // 응답 바디에 JSON 문자열을 작성합니다.
        response.getWriter().write(responseBodyJson);
        response.getWriter().flush();
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);
    }
}
