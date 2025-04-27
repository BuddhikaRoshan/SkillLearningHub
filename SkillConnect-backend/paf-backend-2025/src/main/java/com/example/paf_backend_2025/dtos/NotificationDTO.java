package com.example.pafbackend.dtos;

import java.util.Date;

public class NotificationDTO {

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private String id;
    private String title;
    private String message;
    private Date createdAt;

    public NotificationDTO() {}

    public NotificationDTO(String id, String title, String message, Date createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
}
