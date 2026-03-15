package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.dto.UpdateAppointmentTimeRequest;
import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.repository.DoctorRepository;
import com.example.HospitalManagementSystem.repository.PatientRepository;
import com.example.HospitalManagementSystem.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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

    /** Current logged-in patient's appointments (so they can see time and any updates). */
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    public List<Appointment> getMyAppointments() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Patient patient = patientRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return service.getAppointmentsByPatient(patient);
    }

    /** Update appointment time only (ADMIN). Body: { "appointmentTime": "2024-06-15T10:30:00" } */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody UpdateAppointmentTimeRequest request
    ) {
        if (request == null || request.getAppointmentTime() == null) {
            throw new IllegalArgumentException("Request body must contain appointmentTime (ISO-8601 datetime)");
        }
        return service.updateAppointmentTime(id, request.getAppointmentTime());
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
