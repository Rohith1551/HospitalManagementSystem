package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.repository.AppointmentRepository;
import com.example.HospitalManagementSystem.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // ================= DOCTOR PROFILE =================
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/profile")
    public Doctor myProfile() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return doctorRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // ================= DOCTOR APPOINTMENTS =================
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/appointments")
    public List<Appointment> myAppointments() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Doctor doctor = doctorRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return appointmentRepository.findByDoctor(doctor);
    }

    // ================= UPDATE APPOINTMENT STATUS =================
    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/appointment/{id}/status")
    public Appointment updateStatus(
            @PathVariable Long id,
            @RequestParam Appointment.Status status
    ) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
