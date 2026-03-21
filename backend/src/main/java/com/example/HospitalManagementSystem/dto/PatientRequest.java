package com.example.HospitalManagementSystem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientRequest {
    private String username;
    private String password;
    private String name;
    private Integer age;
    private String phone;
    private String problem;
    private String medicalHistory;
}
