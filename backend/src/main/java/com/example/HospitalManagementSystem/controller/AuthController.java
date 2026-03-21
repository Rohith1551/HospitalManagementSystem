package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.entity.Role;
import com.example.HospitalManagementSystem.entity.User;
import com.example.HospitalManagementSystem.repository.RoleRepository;
import com.example.HospitalManagementSystem.repository.UserRepository;
import com.example.HospitalManagementSystem.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private JwtUtil util;

    @Autowired
    private UserRepository UserRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    RoleRepository RoleRepo;

    @PostMapping("/register")
    @Transactional
    public String register(@RequestBody User user){

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role role = RoleRepo.findByName("ROLE_PATIENT").orElseThrow(() -> new RuntimeException("Roles not found"));

        user.setRoles(Set.of(role));


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

        if(user.getRoles() == null || user.getRoles().isEmpty()){
            throw new RuntimeException("User has no roles assigned. Please contact administrator.");
        }

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return util.generateToken(user.getUsername(),roles);



    }


}
