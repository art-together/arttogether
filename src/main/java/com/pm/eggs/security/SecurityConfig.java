package com.pm.eggs.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.sql.DataSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthFailure authFailure;

    @Autowired
    private AuthSuccess authSuccess;

    @Autowired
    private EntryPointUnauthorizedHandler unauthorizedHandler;

    @Autowired
    private LogoutSuccess logoutSuccess;

    @Autowired
    private UserDetailServiceImpl userDetailService;

    /*@Autowired
    public void configAuthBuilder(AuthenticationManagerBuilder builder) throws Exception {
        System.out.println("IN AUTH");
        builder.userDetailsService(userDetailService);
    }*/

    @Autowired
    DataSource dataSource;

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {

        auth.jdbcAuthentication().dataSource(dataSource).passwordEncoder(new BCryptPasswordEncoder())
                .usersByUsernameQuery(
                        "select email,password,enabled from app_user where email = ?")
                .authoritiesByUsernameQuery(
                        "select app_user.email, role.name from app_user " +
                        "join app_user_Roles on app_user.id = app_user_Roles.users_id " +
                        "join role on app_user_Roles.roles_id = role.id " +
                        "where app_user.email = ?");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {


        http
                .csrf().disable()
                .exceptionHandling()
                    .authenticationEntryPoint(unauthorizedHandler)
                    .and()
                .formLogin()
                    .usernameParameter("email").passwordParameter("password")
                    .successHandler(authSuccess)
                    .failureHandler(authFailure)
                .and()
                .logout().logoutSuccessHandler(logoutSuccess).deleteCookies("JSESSIONID").invalidateHttpSession(false)
                .and()
                .authorizeRequests()
                    .antMatchers("/**")
                        .permitAll();
    }
}
