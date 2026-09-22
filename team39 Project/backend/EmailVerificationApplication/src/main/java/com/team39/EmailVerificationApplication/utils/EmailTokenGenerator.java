package com.team39.EmailVerificationApplication.utils;

import com.team39.EmailVerificationApplication.models.ApplicationUser;
import com.team39.EmailVerificationApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;


@Component
public class EmailTokenGenerator {


    @Autowired
    private UserRepository userRepository;


    public String generateToken(int length) {
        String emailToken;
        Optional<ApplicationUser> existingUser;
        int expiryMinutes = 30; //sets the token expiry minutes to be 30
        LocalDateTime expiryDateTime;

        do {
            // Generate a new email token
            StringBuilder sb = new StringBuilder(length);
            SecureRandom secureRandom = new SecureRandom();
            for (int i = 0; i < length; i++) {
                sb.append(secureRandom.nextInt(10)); // Generates a random digit (0-9)
            }
            emailToken = sb.toString();


            // Check if the email token already exists in the database
            existingUser = userRepository.findByEmailToken(emailToken);
        } while (existingUser.isPresent()); // Keep generating new tokens until a unique one is found

        return emailToken;
    }

    public LocalDateTime generateTokenExpiry(){
        int expiryMinutes = 30;

        return LocalDateTime.now().plusMinutes(expiryMinutes);
    }





}



