package com.example.pafbackend.dtos;

import java.util.List;

public class PostDTO {
    private String caption;
    private String userId;
    private List<String> mediaTypeIds;
    private List<String> taggedUserIds;

    // Getters and Setters
    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getMediaTypeIds() {
        return mediaTypeIds;
    }

    public void setMediaTypeIds(List<String> mediaTypeIds) {
        this.mediaTypeIds = mediaTypeIds;
    }

    public List<String> getTaggedUserIds() {
        return taggedUserIds;
    }

    public void setTaggedUserIds(List<String> taggedUserIds) {
        this.taggedUserIds = taggedUserIds;
    }
}