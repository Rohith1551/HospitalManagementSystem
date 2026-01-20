package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.entity.User;
import com.example.HospitalManagementSystem.repository.UserRepository;
import com.example.HospitalManagementSystem.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private JwtUtil util;

    @Autowired
    private UserRepository UserRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody User user){

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        UserRepo.save(user);

        return "User registered successfully";

    }

    @PostMapping("/login")
    public String login(@RequestBody User requestUser){

        User user = UserRepo.findByUsername(requestUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Username not found"));

        if(!passwordEncoder.matches(requestUser.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid Password");

        }

        return util.generateToken(user.getUsername()) + ( "\n" + user.getUsername() + " " + "login successfull");



    }


}
