package com.pm.eggs.service;

import com.pm.eggs.entity.Role;
import com.pm.eggs.entity.User;
import com.pm.eggs.repo.RoleRepo;
import com.pm.eggs.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class InitDBService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @PostConstruct
    public void init() {

        if (roleRepo.findByName("ROLE_ADMIN") == null) {
            Role roleUser = new Role();
            roleUser.setName("ROLE_USER");
            roleRepo.save(roleUser);

            Role roleAdmin = new Role();
            roleAdmin.setName("ROLE_ADMIN");
            roleRepo.save(roleAdmin);

            User userAdmin = new User();
            userAdmin.setEnabled(true);
            userAdmin.setFirstname("admin");
            userAdmin.setLastname("admin");
            userAdmin.setEmail("test@eggs.com");

            /*String salt = BCrypt.gensalt(12);
            String hashed_password = BCrypt.hashpw("admin", salt);*/
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            userAdmin.setPassword(encoder.encode("admin"));
           // userAdmin.setPassword(hashed_password);

            List<Role> roles = new ArrayList<>();
            roles.add(roleAdmin);
            roles.add(roleUser);
            userAdmin.setRoles(roles);
            userRepo.save(userAdmin);
        }

    }

}
