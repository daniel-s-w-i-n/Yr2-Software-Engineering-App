package com.team39.authenticatedbackend.services;

import com.team39.authenticatedbackend.models.*;
import com.team39.authenticatedbackend.repository.RoleRepository;
import com.team39.authenticatedbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthenticationService {


    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;


    public void registerUser(String username, String password, String firstName,
                             String lastName, String phoneNumber, Integer departmentID){

        String encodedPassword = passwordEncoder.encode(password);
        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        userRepository.save(new ApplicationUser(0, username, encodedPassword, authorities,
                firstName, lastName, phoneNumber, departmentID
        ));
    }


    public ForgotPasswordDTO updatePassword(String email, String newPassword) {
        ApplicationUser user = userRepository.findByUsername(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Authenticate user with the new password
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, newPassword)
        );

        // Generate a new JWT token for the user
        String token = tokenService.generateJwt(auth);

        // Create and return a ForgotPasswordDTO with the new JWT token
        return new ForgotPasswordDTO(token);
    }

    public LoginResponseDTO loginUser(String username, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = tokenService.generateJwt(auth);
            return new LoginResponseDTO(token);
        } catch (AuthenticationException e) {
            return new LoginResponseDTO("");
        }
    }

    public EmailExistsDTO checkUserExists(String username){
        boolean userExists = userRepository.findByUsername(username).isPresent();
        return new EmailExistsDTO(userExists);
    }

    public PhoneNumberExistsDTO checkPhoneNumberExists(String phoneNumber){

        boolean phoneNumberExists = userRepository.findByPhoneNumber(phoneNumber).isPresent();

        return new PhoneNumberExistsDTO(phoneNumberExists);
    }












}
