package com.team39.EmailVerificationApplication.services;

import com.team39.EmailVerificationApplication.models.ApplicationUser;
import com.team39.EmailVerificationApplication.models.EmailVerifyDTO;
import com.team39.EmailVerificationApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class EmailVerifyService {

    @Autowired
    private UserRepository userRepository;

    public EmailVerifyDTO verifyEmail(String email, String emailToken){


        Optional<ApplicationUser> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException( email + " does not exist in emailVerificationTable"); // Or any other suitable exception
        }

        LocalDateTime emailTokenExpiry = userRepository.findEmailTokenExpiryByEmail(email);
        String emailTokenInDatabase = (userRepository.findEmailTokenInDatabase(email));


        System.out.println(emailToken);

        if (emailTokenInDatabase.equals(emailToken) &&
                emailTokenExpiry != null && !emailTokenExpiry.isBefore(LocalDateTime.now())) {

            boolean verified = true;
            userRepository.updateVerificationStatus(email, emailToken);
            return new EmailVerifyDTO(verified);

        } else {

            boolean verified = false;
            return new EmailVerifyDTO(verified);
        }
    }
}