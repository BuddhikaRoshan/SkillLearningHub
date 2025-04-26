package com.example.paf_backend_2025.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String caption;
    private boolean deleteStatus;
    private Date createdAt;
    private Date updatedAt;

    @DBRef
    private AppUser user;

    @DBRef
    private List<MediaType> mediaTypes;

    @DBRef
    private List<AppUser> taggedUsers;
    public Post() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deleteStatus = false;
    }

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

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
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