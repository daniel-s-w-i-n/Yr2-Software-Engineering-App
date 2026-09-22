package com.team39.authenticatedbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.team39.authenticatedbackend.repository.UserRepository;

//this class determines if the user's username and password match up

@Service
public class UserService implements UserDetailsService {



    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserRepository userRepository;




    //this methods checks the user that is being requested and indicates if its working properly
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("user is not valid"));

    }




}
