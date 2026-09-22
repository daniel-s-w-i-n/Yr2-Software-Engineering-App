package com.team39.authenticatedbackend.controllers;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")

public class UserController {


    @GetMapping("/")
    public String helloUserController(){

        return "User access level"; //signifies that this is accessible by a user
    }


}
