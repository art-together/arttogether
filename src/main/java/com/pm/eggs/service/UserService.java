package com.pm.eggs.service;


import com.pm.eggs.entity.User;
import com.pm.eggs.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public void save(User user) {
        userRepo.save(user);
    }

    public boolean checkUniqueEmail(String email) {
        if (userRepo.findByEmail(email) != null) {
            return false;
        } else {
            return true;
        }
    }

    public void verifyUserEmail(String hash, String email) {
        User user = userRepo.findByEmail(email);
        if (user.getVerifyLink().equals(hash)) {
            user.setEnabled(true);
            userRepo.saveAndFlush(user);
        }
    }
}
