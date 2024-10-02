package com.ict.backend.jwt;


import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.vo.MemberVO;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //System.out.println("id "+ request.getParameter("userid"));
        //System.out.println("pass" + request.getParameter("username"));
        //request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {

            System.out.println("12token null");
            filterChain.doFilter(request, response);

            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        String token = authorization.split(" ")[1];

        //토큰 소멸 시간 검증
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            //response body
            System.out.println("token expired");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
//        if (jwtUtil.isExpired(token)) {
//
//            System.out.println("token expired");
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            //filterChain.doFilter(request, response);
//            //조건이 해당되면 메소드 종료 (필수)
//            return;
//        }


        String userid = jwtUtil.getUserid(token);
        String role = jwtUtil.getRole(token);

        MemberVO memberVO = new MemberVO();
        memberVO.setUserid(userid);
        memberVO.setUserpwd("temppassword");
        memberVO.setRole(role);

        CustomUserDetails customUserDetails = new CustomUserDetails(memberVO);

        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
