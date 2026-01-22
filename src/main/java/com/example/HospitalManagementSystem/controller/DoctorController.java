package com.example.HospitalManagementSystem.controller;


import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Doctor")
public class DoctorController {

    @Autowired
    private DoctorService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createDoctor")
    public Doctor createDoctor(@RequestBody Doctor doctor){
        return service.createDoctor(doctor);
    }

    @GetMapping("/getAllDoctors")
    public List<Doctor> getAllDoctors(){

        return service.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id){
         return service.getDoctorById(id);
    }

    @PutMapping("updateDoctor/{id}")
    public Doctor updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor){
        return service.updateDoctor(id,doctor);
    }

    @DeleteMapping("deleteDoctor/{id}")
    public void deleteDoctor(@PathVariable Long id){
        service.deleteDoctor(id);
    }

}
