package com.example.HospitalManagementSystem.service;

import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repo;



    public Patient createPatient(Patient patient){
        return repo.save(patient);
    }

    public List<Patient> getAllPatients(){
        return repo.findAll();
    }

    public Patient getPatientById(Long id){
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Patient id not found " +id ));
    }

    public Patient updatePatient(Long id,Patient patient){

        Patient existing = getPatientById(id);
        existing.setName(patient.getName());
        existing.setAge(patient.getAge());
        existing.setPhone(patient.getPhone());
        existing.setMedicalHistory(patient.getMedicalHistory());
        existing.setProblem(patient.getProblem());
        return repo.save(existing);
    }

    public void deletePatientById(Long id){
        repo.deleteById(id);
    }

}
