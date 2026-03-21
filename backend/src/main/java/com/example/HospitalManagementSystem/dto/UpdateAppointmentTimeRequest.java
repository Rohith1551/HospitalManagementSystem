package com.example.HospitalManagementSystem.dto;

import java.time.LocalDateTime;

public class UpdateAppointmentTimeRequest {

    private LocalDateTime appointmentTime;

    public UpdateAppointmentTimeRequest() {
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }
}