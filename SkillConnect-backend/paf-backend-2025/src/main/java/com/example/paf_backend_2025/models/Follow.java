package com.example.paf_backend_2025.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "follows")
public class Follow {

    @Id
    private String id;

    @DBRef
    private AppUser follower;

    @DBRef
    private AppUser following;

    private Date followedAt;

    public Follow() {
        this.followedAt = new Date();
    }

    public Follow(AppUser follower, AppUser following) {
        this.follower = follower;
        this.following = following;
        this.followedAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public AppUser getFollower() {
        return follower;
    }

    public void setFollower(AppUser follower) {
        this.follower = follower;
    }

    public AppUser getFollowing() {
        return following;
    }

    public void setFollowing(AppUser following) {
        this.following = following;
    }

    public Date getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(Date followedAt) {
        this.followedAt = followedAt;
    }
}
