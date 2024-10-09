package com.ict.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
//                .allowCredentials(true);
    }
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("*")  // 외부에서 접근할 경로 설정
                .addResourceLocations("file:///D:/team3_final_project/images/");  // 실제 파일 경로 설정
    }
}
