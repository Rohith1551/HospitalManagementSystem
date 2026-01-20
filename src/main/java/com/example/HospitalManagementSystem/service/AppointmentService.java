package com.example.HospitalManagementSystem.service;


import com.example.HospitalManagementSystem.entity.Appointment;
import com.example.HospitalManagementSystem.entity.Doctor;
import com.example.HospitalManagementSystem.entity.Patient;
import com.example.HospitalManagementSystem.repository.AppointmentRepository;
import com.example.HospitalManagementSystem.repository.DoctorRepository;
import com.example.HospitalManagementSystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository Arepo;

    @Autowired
    private PatientRepository Prepo;

    @Autowired
    private DoctorRepository Drepo;

    public Appointment createAppointment( Long patientId, Long doctorId, Appointment appointment){
        Patient patient = Prepo.findById(patientId).
                orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = Drepo.findById(doctorId).
                orElseThrow(() -> new RuntimeException("Doctor not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setStatus("BOOKED");

        return Arepo.save(appointment);

    }

    public List<Appointment> getAllAppointments(){
        return Arepo.findAll();
    }

    public Appointment getAppointmentById(Long AId){
        return Arepo.findById(AId).
                orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId){
        return Arepo.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId){
        return Arepo.findByPatientId(patientId);
    }

    public Appointment updateStatus(Long id, String status){

        Appointment appointment = getAppointmentById(id);

        appointment.setStatus(status);
        return Arepo.save(appointment);

    }

    public void deleteAppointmentById(Long id){
        Arepo.deleteById(id);
    }





}
