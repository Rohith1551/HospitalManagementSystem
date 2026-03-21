package com.example.HospitalManagementSystem.service;


import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository repo;

    public Doctor createDoctor(Doctor doctor){
         return repo.save(doctor);
    }

    public List<Doctor> getAllDoctors(){
        return repo.findAll();
    }

    public Doctor getDoctorById(Long id){
        return repo.findById(id).orElseThrow(() -> new RuntimeException("No doctor found"));
    }

    public Doctor updateDoctor(Long id, Doctor doctor){

        Doctor existing = getDoctorById(id);
        existing.setName(doctor.getName());
        existing.setSpecialization(doctor.getSpecialization());
        existing.setPhone(doctor.getPhone());

        return repo.save(existing);
    }

    public void deleteDoctor(Long id){
        repo.deleteById(id);
    }

}
