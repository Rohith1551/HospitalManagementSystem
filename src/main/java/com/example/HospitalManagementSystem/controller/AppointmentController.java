package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.repository.DoctorRepository;
import com.example.HospitalManagementSystem.repository.PatientRepository;
import com.example.HospitalManagementSystem.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    // ================= CREATE APPOINTMENT =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/patient/{patientId}/doctor/{doctorId}")
    public Appointment createAppointment(
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            @RequestBody Appointment appointment
    ) {
        return service.createAppointment(patientId, doctorId, appointment);
    }

    // ================= GET ALL (ADMIN) =================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Appointment> getAllAppointments() {
        return service.getAllAppointments();
    }

    // ================= GET BY ID =================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return service.getAppointmentById(id);
    }

    // ================= GET BY DOCTOR =================
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return service.getAppointmentsByDoctor(doctor);
    }

    // ================= GET BY PATIENT =================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(@PathVariable Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return service.getAppointmentsByPatient(patient);
    }

    // ================= UPDATE STATUS =================
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @PutMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Appointment.Status status
    ) {
        return service.updateStatus(id, status);
    }

    // ================= DELETE =================
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteAppointmentById(@PathVariable Long id) {
        service.deleteAppointmentById(id);
    }
}
