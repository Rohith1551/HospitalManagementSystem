package com.example.HospitalManagementSystem.repository;

import com.example.HospitalManagementSystem.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DoctorRepository extends JpaRepository<Doctor,Long> {
}
