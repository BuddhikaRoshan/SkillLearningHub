package com.example.paf_backend_2025.dtos;

import com.example.pafbackend.models.AppUser;
import com.example.pafbackend.models.MediaType;

import java.util.Date;
import java.util.List;

public class PostResponseDTO {
    private String id;
    private String caption;
    private Date createdAt;
    private Date updatedAt;
    private AppUser user;
    private List<MediaType> mediaTypes;
    private List<AppUser> taggedUsers;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public List<MediaType> getMediaTypes() {
        return mediaTypes;
    }

    public void setMediaTypes(List<MediaType> mediaTypes) {
        this.mediaTypes = mediaTypes;
    }

    public List<AppUser> getTaggedUsers() {
        return taggedUsers;
    }

    public void setTaggedUsers(List<AppUser> taggedUsers) {
        this.taggedUsers = taggedUsers;
    }
}