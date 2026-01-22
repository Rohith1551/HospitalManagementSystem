package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.repository.PatientRepository;
import com.example.HospitalManagementSystem.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired
    private PatientService service;

    @Autowired
    private PatientRepository patientRepository;
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/profile")
    public Patient myProfile() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return patientRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }



    // Admin can view patient by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id){
        return service.getPatientById(id);
    }

    // Admin can view all patients
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Patient> getAllPatients(){
        return service.getAllPatients();
    }
}
