package com.example.HospitalManagementSystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssignAppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
}
