package com.example.pafbackend.dtos;

import com.example.pafbackend.models.AppUser;
import com.example.pafbackend.models.Post;
import java.util.Date;

public class LikeResponseDTO {
    private String id;
    private Date createdAt;
    private AppUser user;
    private Post post;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}