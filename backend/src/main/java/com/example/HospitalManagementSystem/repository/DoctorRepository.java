package com.example.HospitalManagementSystem.repository;

import com.example.HospitalManagementSystem.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserUsername(String username);
}
