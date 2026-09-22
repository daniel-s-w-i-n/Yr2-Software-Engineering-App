package com.team39.authenticatedbackend.controllers;
import com.team39.authenticatedbackend.models.*;
import com.team39.authenticatedbackend.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // allows mapping of endpoints to server
@RequestMapping("/auth")// allows this controller to be mapped to a specific endpoint
@CrossOrigin("*")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody RegistrationDTO body) {
        authenticationService.registerUser(
                body.getUsername(),
                body.getPassword(),
                body.getFirstName(),
                body.getLastName(),
                body.getPhoneNumber(),
                body.getDepartmentID());
        return ResponseEntity.ok().build();
    }


    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody RegistrationDTO body){
        return authenticationService.loginUser(body.getUsername(), body.getPassword());
    }
    @PostMapping("/emailExists")
    public EmailExistsDTO checkEmailExists(@RequestBody RegistrationDTO body){
        return authenticationService.checkUserExists(body.getUsername());
    }
    @PostMapping("/phoneNumberExists")
    public PhoneNumberExistsDTO checkPhoneNumberExists(@RequestBody RegistrationDTO body){
        return authenticationService.checkPhoneNumberExists(body.getPhoneNumber());
    }

    @PostMapping("/forgotPassword")
    public ForgotPasswordDTO forgotPassword(@RequestBody RegistrationDTO body) {
        return authenticationService.updatePassword(body.getPasswordResetEmail(), body.getNewPassword());
    }
}
