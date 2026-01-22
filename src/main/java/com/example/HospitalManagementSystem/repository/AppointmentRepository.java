package com.example.HospitalManagementSystem.repository;

import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor(Doctor doctor);

    // ✅ ADD THIS
    List<Appointment> findByPatient(Patient patient);
}
