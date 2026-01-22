package com.example.HospitalManagementSystem.controller;

import com.example.HospitalManagementSystem.dto.AssignAppointmentRequest;
import com.example.HospitalManagementSystem.dto.DoctorRequest;
import com.example.HospitalManagementSystem.dto.PatientRequest;
import com.example.HospitalManagementSystem.entity.*;
import com.example.HospitalManagementSystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= CREATE DOCTOR =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-doctor")
    public String createDoctor(@RequestBody DoctorRequest req) {

        Role doctorRole = roleRepository.findByName("ROLE_DOCTOR")
                .orElseThrow(() -> new RuntimeException("ROLE_DOCTOR not found"));

        // create auth user
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Set.of(doctorRole));
        userRepository.save(user);

        // create doctor entity
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setName(req.getName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setPhone(req.getPhone());
        doctor.setActive(true);

        doctorRepository.save(doctor);

        return "Doctor created successfully";
    }

    // ================= CREATE PATIENT =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-patient")
    public String createPatient(@RequestBody PatientRequest req) {

        Role patientRole = roleRepository.findByName("ROLE_PATIENT")
                .orElseThrow(() -> new RuntimeException("ROLE_PATIENT not found"));

        // create auth user
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Set.of(patientRole));
        userRepository.save(user);

        // create patient entity
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setName(req.getName());
        patient.setAge(req.getAge());
        patient.setPhone(req.getPhone());
        patient.setProblem(req.getProblem());
        patient.setMedicalHistory(req.getMedicalHistory());
        patient.setEntryTime(LocalDateTime.now());

        patientRepository.save(patient);

        return "Patient created successfully";
    }

    // ================= ASSIGN APPOINTMENT =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign-appointment")
    public String assignAppointment(@RequestBody AssignAppointmentRequest req) {

        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(req.getAppointmentTime());
        appointment.setStatus(Appointment.Status.SCHEDULED); // matches your String status

        appointmentRepository.save(appointment);

        return "Appointment assigned successfully";
    }
}
