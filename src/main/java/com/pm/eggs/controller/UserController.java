package com.pm.eggs.controller;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.pm.eggs.entity.Role;
import com.pm.eggs.entity.User;
import com.pm.eggs.repo.RoleRepo;
import com.pm.eggs.service.UserService;
import com.pm.eggs.utils.Mail;
import com.pm.eggs.wrappers.Account;
import com.pm.eggs.wrappers.EggImg;
import com.pm.eggs.wrappers.LoginForm;
import com.pm.eggs.wrappers.RegisterForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sun.misc.BASE64Decoder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepo roleRepo;


    @RequestMapping(value = "/eggs/rest/user/register", method = RequestMethod.POST)
    public boolean register(@RequestBody RegisterForm form) {
        boolean available = userService.checkUniqueEmail(form.getEmail());
        if (available) {
            String name = form.getFirstname() + " " + form.getLastname();
            User user = new User();
            user.setFirstname(form.getFirstname());
            user.setLastname(form.getLastname());

            user.setEmail(form.getEmail());

            List<Role> roles = new ArrayList<>();
            roles.add(roleRepo.findByName("ROLE_USER"));
            user.setRoles(roles);

            String hashLink = UUID.randomUUID().toString();
            String verify = "http://arttogether.com/#/verify/" + form.getEmail() + "/" + hashLink;
            user.setVerifyLink(hashLink);

            final String username = "info@arttogether.com";
            final String password = "ATbest2016";

            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            Session session = Session.getInstance(props,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(username, password);
                        }
                    });

            try {

                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(username));
                message.setRecipients(Message.RecipientType.TO,
                        InternetAddress.parse(form.getEmail()));
                message.setSubject("Confirm email");
                message.setText("Dear " + name + "!" +
                        " Please verify your email " +
                        verify);

                Transport.send(message);

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            user.setPassword(encoder.encode(form.getPassword()));

            userService.save(user);
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping("/eggs/rest/user/verify")
    public void verify(@RequestParam("hash") String hash, @RequestParam("email") String email)
    {
        userService.verifyUserEmail(hash, email);
    }

    @RequestMapping(value = "/eggs/rest/user/login", method = RequestMethod.POST)
    public Account login(@RequestBody LoginForm form,
                         HttpServletResponse response, HttpServletRequest req, HttpSession session)
    {
        User user = userService.findByEmail(form.getEmail());
        Account account = new Account();
        if (user.isEnabled()) {
            if (BCrypt.checkpw(form.getPassword(), user.getPassword())) {
                session = req.getSession(true);
                session.setAttribute("user", form.getEmail());
                session.setMaxInactiveInterval(30*60);

                Cookie cookie = new Cookie("user_sid", session.getId());
                cookie.setMaxAge(30 * 60);
                cookie.setPath("/");
                response.addCookie(cookie);
                account.setName(user.getFirstname() + " " + user.getLastname());
                account.setLogged(true);
            } else {
                account.setLogged(false);
            }
        }
        return account;
    }

    @RequestMapping("/eggs/rest/user/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            request.logout();
        } catch (ServletException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/eggs/rest/user/check")
    public void check() {
        String s = SecurityContextHolder.getContext().getAuthentication().toString();
    }


    @RequestMapping(value = "/eggs/rest/user/aws", method = RequestMethod.POST)
    public void test(@RequestBody EggImg egg) throws IOException {

        String imageString = egg.getImg();

        String key = System.getenv("AWS_ACCESS_KEY_ID");
        String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
        String bucket = "moroz";

        byte[] bI;
        BASE64Decoder decoder = new BASE64Decoder();
        bI = decoder.decodeBuffer(imageString);

        InputStream fis = new ByteArrayInputStream(bI);

        AWSCredentials awsCredentials = new BasicAWSCredentials(key, secretKey);
        AmazonS3 s3 = new AmazonS3Client(awsCredentials);


        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(bI.length);
        metadata.setContentType("image/svg+xml");
        metadata.setCacheControl("public, max-age=31536000");
        s3.putObject(new PutObjectRequest(bucket, "test.svg", fis, metadata));
        s3.setObjectAcl(bucket, "test.svg", CannedAccessControlList.PublicRead);

    }
}
