package com.example.HospitalManagementSystem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorRequest {
    private String username;
    private String password;
    private String name;
    private String specialization;
    private String phone;
}
