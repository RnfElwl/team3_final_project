package com.ict.backend.dto;


import com.ict.backend.vo.MemberVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private MemberVO memberVO;

    public CustomUserDetails(MemberVO memberVO) {

        this.memberVO = memberVO;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return memberVO.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getPassword() {

        return memberVO.getUserpwd();
    }

    @Override
    public String getUsername() {

        return memberVO.getUserid();
    }

    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    @Override
    public boolean isEnabled() {

        return true;
    }
}
