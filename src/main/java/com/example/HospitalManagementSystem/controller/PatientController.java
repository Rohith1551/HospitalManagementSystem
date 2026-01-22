package com.example.HospitalManagementSystem.controller;


import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired
    private PatientService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createPatient")
    public Patient createPatient(@RequestBody Patient patient){
        return service.createPatient(patient);
    }

    @GetMapping("/{id}")
     public Patient getPatientsById(@PathVariable Long id){
         return service.getPatientById(id);
     }

    @GetMapping("/patients")
    public List<Patient> getAllPatients(){
        return service.getAllPatients();
    }

    @PutMapping("/updatePatient/{id}")
    public Patient updatePatient(@PathVariable Long id,@RequestBody Patient patient){
        return service.updatePatient(id,patient);
    }

    @DeleteMapping("/deletePatient/{id}")
    public void deletePatientById(@PathVariable Long id){
        service.deletePatientById(id);
    }

}
