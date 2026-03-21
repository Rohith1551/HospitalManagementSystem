package com.example.HospitalManagementSystem.security;

import com.example.HospitalManagementSystem.entity.User;
import com.example.HospitalManagementSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{

        User user = repo.findByUsername(username).
                orElseThrow( () -> new UsernameNotFoundException("username not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .toArray(String[] :: new)
                )
                .build();
    }

}
