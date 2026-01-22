package com.example.HospitalManagementSystem.controller;


import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/Patient/{patientId}/doctor/{doctorId}")
    public Appointment createAppointment(@PathVariable Long patientId,
                                         @PathVariable Long doctorId,
                                         @RequestBody Appointment appointment){
        return service.createAppointment(patientId,doctorId,appointment);

    }

    @GetMapping("/allAppointments")
    public List<Appointment> getAllAppointments(){
        return service.getAllAppointments();
    }

    @GetMapping("{id}")
    public Appointment getAppointmentById(@PathVariable Long id){
        return service.getAppointmentById(id);
    }

    @GetMapping("/Doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable Long doctorId){
        return service.getAppointmentsByDoctor(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatients(@PathVariable Long patientId){
        return service.getAppointmentsByPatient(patientId);
    }

    @PutMapping("/{id}/status")
    public Appointment updateAppointment(@PathVariable Long id,@RequestParam String status){

        return service.updateStatus(id,status);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointmentById(@PathVariable Long id){
        service.deleteAppointmentById(id);
    }


}
