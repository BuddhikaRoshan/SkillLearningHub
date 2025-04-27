package com.example.pafbackend.dtos;

public class FollowRequestDto {
    private String followerId;
    private String followingId;

    // Getters and Setters
    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getFollowingId() {
        return followingId;
    }

    public void setFollowingId(String followingId) {
        this.followingId = followingId;
    }
}
