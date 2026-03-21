package com.example.HospitalManagementSystem.repository;

import com.example.HospitalManagementSystem.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByUserUsername(String username);

}
