package com.team39.EmailVerificationApplication.services;

import com.team39.EmailVerificationApplication.models.ApplicationUser;
import com.team39.EmailVerificationApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class EmailTokenSaveService {


    @Autowired
    private UserRepository userRepository;



    public void saveEmailToken(String email, String emailToken, LocalDateTime emailTokenExpiryDate) {

        Boolean verified = false;
        Optional<ApplicationUser> existingUserOptional = userRepository.findByEmail(email);


        ApplicationUser user;

        if (existingUserOptional.isPresent()) {
            // User with the specified email already exists, update their details
            user = existingUserOptional.get();
            user.setEmailToken(emailToken);
            user.setEmailTokenExpiry(emailTokenExpiryDate);
        } else {
            // User with the specified email does not exist, create a new user
            user = new ApplicationUser();
            user.setEmail(email);
            user.setEmailToken(emailToken);
            user.setEmailTokenExpiry(emailTokenExpiryDate);
            user.setVerified(verified); // Assuming this field needs to be set for new users
        }

        // Save the user (either existing user with updated details or new user)

        userRepository.save(user);
    }









}
