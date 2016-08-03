package com.pm.eggs.security;

import com.pm.eggs.entity.User;
import com.pm.eggs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UserService service;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = service.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException("no user found with " + email);
        }
        return new AccountUserDetails(user);
    }
}
